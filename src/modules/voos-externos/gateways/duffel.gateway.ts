import {
  Injectable,
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';
import { SliceOfertaDto } from '../dto/slice-oferta.dto';
import { SegmentoOfertaDto } from '../dto/segmento-oferta.dto';
import { SugestaoLugarDto } from '../dto/sugestao-lugar.dto';

interface DuffelSegmento {
  marketing_carrier: { name: string; iata_code: string };
  marketing_carrier_flight_number: string;
  origin: { iata_code: string };
  destination: { iata_code: string };
  departing_at: string;
  arriving_at: string;
}

interface DuffelOferta {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{ segments: DuffelSegmento[] }>;
}

interface DuffelLugar {
  type: 'airport' | 'city';
  name: string;
  iata_code: string;
  city_name: string | null;
}

/**
 * Integração com a Duffel API (https://duffel.com/docs/api).
 * Usa o ambiente de teste (sandbox) por padrão — nenhum dado é gerado ao vivo
 * enquanto DUFFEL_API_TOKEN não for configurado com um token de teste real.
 *
 * Cada slice da Duffel (ida ou volta) pode ter vários segments (conexões).
 * Mapeamos slice → direção (IDA/VOLTA) e segment → trecho, na ordem em que
 * aparecem — essa ordem é o que popula `ReservaTrecho.ordem` quando a oferta
 * é importada.
 */
@Injectable()
export class DuffelGateway implements BuscaVoosGatewayContract {
  constructor(private readonly config: ConfigService) {}

  private get token(): string {
    const token = this.config.get<string>('DUFFEL_API_TOKEN');
    if (!token) {
      throw new InternalServerErrorException(
        'DUFFEL_API_TOKEN não configurado. Crie uma conta gratuita em duffel.com e adicione o token de teste no .env',
      );
    }
    return token;
  }

  private get baseUrl(): string {
    return (
      this.config.get<string>('DUFFEL_BASE_URL') ?? 'https://api.duffel.com'
    );
  }

  private async chamarApi<T>(path: string, init?: RequestInit): Promise<T> {
    const resposta = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Duffel-Version': 'v2',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...init?.headers,
      },
    });

    if (!resposta.ok) {
      const corpo = await resposta.text();
      throw new BadGatewayException(
        `Duffel API retornou ${resposta.status}: ${corpo}`,
      );
    }

    return resposta.json() as Promise<T>;
  }

  async buscarOfertas(params: {
    origem: string;
    destino: string;
    dataIda: string;
    dataVolta?: string;
  }): Promise<OfertaVooDto[]> {
    const slices = [
      {
        origin: params.origem,
        destination: params.destino,
        departure_date: params.dataIda,
      },
    ];
    if (params.dataVolta) {
      slices.push({
        origin: params.destino,
        destination: params.origem,
        departure_date: params.dataVolta,
      });
    }

    const resposta = await this.chamarApi<{ data: { offers: DuffelOferta[] } }>(
      '/air/offer_requests?return_offers=true',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            slices,
            passengers: [{ type: 'adult' }],
            cabin_class: 'economy',
          },
        }),
      },
    );

    return resposta.data.offers.map((oferta) => this.paraOfertaVooDto(oferta));
  }

  async buscarSugestoesLugar(query: string): Promise<SugestaoLugarDto[]> {
    const resposta = await this.chamarApi<{ data: DuffelLugar[] }>(
      `/places/suggestions?query=${encodeURIComponent(query)}`,
    );

    return resposta.data.map(
      (lugar) =>
        new SugestaoLugarDto({
          iataCode: lugar.iata_code,
          nome: lugar.name,
          cidade: lugar.city_name,
          tipo: lugar.type,
        }),
    );
  }

  async buscarOfertaPorId(ofertaId: string): Promise<OfertaVooDto | null> {
    try {
      const resposta = await this.chamarApi<{ data: DuffelOferta }>(
        `/air/offers/${ofertaId}`,
      );
      return this.paraOfertaVooDto(resposta.data);
    } catch {
      return null;
    }
  }

  private paraOfertaVooDto(oferta: DuffelOferta): OfertaVooDto {
    if (
      oferta.slices.length === 0 ||
      oferta.slices.some((slice) => slice.segments.length === 0)
    ) {
      throw new BadGatewayException('Oferta da Duffel sem segmentos de voo');
    }

    const slices = oferta.slices.map(
      (slice, indice) =>
        new SliceOfertaDto({
          direcao: indice === 0 ? 'IDA' : 'VOLTA',
          segmentos: slice.segments.map(
            (segmento) =>
              new SegmentoOfertaDto({
                numeroVoo: `${segmento.marketing_carrier.iata_code}${segmento.marketing_carrier_flight_number}`,
                companhia: segmento.marketing_carrier.name,
                origem: segmento.origin.iata_code,
                destino: segmento.destination.iata_code,
                dataPartida: segmento.departing_at,
                dataChegada: segmento.arriving_at,
              }),
          ),
        }),
    );

    const segmentosIda = slices[0].segmentos;

    return new OfertaVooDto({
      ofertaId: oferta.id,
      preco: Number(oferta.total_amount),
      moeda: oferta.total_currency,
      origem: segmentosIda[0].origem,
      destino: segmentosIda[segmentosIda.length - 1].destino,
      idaEVolta: slices.length > 1,
      slices,
    });
  }
}
