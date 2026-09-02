import {
  Injectable,
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';
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
 * MVP: assume voos de ida, sem escala (1 slice, 1 segmento). Voos com conexão
 * retornam apenas o primeiro segmento — suficiente para importar como uma
 * linha da tabela `voos`, que hoje não modela múltiplos trechos.
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
    data: string;
  }): Promise<OfertaVooDto[]> {
    const resposta = await this.chamarApi<{ data: { offers: DuffelOferta[] } }>(
      '/air/offer_requests?return_offers=true',
      {
        method: 'POST',
        body: JSON.stringify({
          data: {
            slices: [
              {
                origin: params.origem,
                destination: params.destino,
                departure_date: params.data,
              },
            ],
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
    const segmento = oferta.slices[0]?.segments[0];
    if (!segmento) {
      throw new BadGatewayException('Oferta da Duffel sem segmentos de voo');
    }

    return new OfertaVooDto({
      ofertaId: oferta.id,
      companhia: segmento.marketing_carrier.name,
      numeroVoo: `${segmento.marketing_carrier.iata_code}${segmento.marketing_carrier_flight_number}`,
      origem: segmento.origin.iata_code,
      destino: segmento.destination.iata_code,
      dataPartida: segmento.departing_at,
      dataChegada: segmento.arriving_at,
      preco: Number(oferta.total_amount),
      moeda: oferta.total_currency,
    });
  }
}
