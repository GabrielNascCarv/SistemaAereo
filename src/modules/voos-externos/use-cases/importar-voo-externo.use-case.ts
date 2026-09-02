import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { BUSCA_VOOS_GATEWAY } from '../voos-externos.tokens';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { VooEntity } from '../../voos/entities/voo.entity';

export interface TrechoImportado {
  vooId: number;
  direcao: 'IDA' | 'VOLTA';
  ordem: number;
  voo: VooEntity;
}

// A Duffel não informa a lotação real do avião nessa oferta — usamos um
// valor fixo razoável para permitir reservas em grupo sem esbarrar em
// "assentos insuficientes" para buscas simples de teste.
const ASSENTOS_DISPONIVEIS_PADRAO = 15;

@Injectable()
export class ImportarVooExternoUseCase {
  constructor(
    @Inject(BUSCA_VOOS_GATEWAY)
    private readonly gateway: BuscaVoosGatewayContract,
    private readonly vooRepository: VooRepository,
  ) {}

  async execute(ofertaId: string): Promise<TrechoImportado[]> {
    const oferta = await this.gateway.buscarOfertaPorId(ofertaId);
    if (!oferta) {
      throw new NotFoundException('Oferta de voo não encontrada');
    }

    // A Duffel não expõe preço por trecho — dividimos o valor total do
    // itinerário entre os voos importados como aproximação (fica exato
    // para itinerários diretos).
    const totalTrechos = oferta.slices.reduce(
      (total, slice) => total + slice.segmentos.length,
      0,
    );
    const precoPorTrecho = oferta.preco / totalTrechos;

    const trechos: TrechoImportado[] = [];

    for (const slice of oferta.slices) {
      for (let indice = 0; indice < slice.segmentos.length; indice++) {
        const segmento = slice.segmentos[indice];

        const dataPartida = new Date(segmento.dataPartida);

        // Idempotente por número + data de partida: o mesmo número de voo
        // pode aparecer em datas diferentes (ou até no trecho de volta, no
        // sandbox da Duffel) — sem a data, reaproveitaríamos o voo errado.
        const voo =
          (await this.vooRepository.findByNumeroVoo(
            segmento.numeroVoo,
            dataPartida,
          )) ??
          (await this.vooRepository.create({
            numeroVoo: segmento.numeroVoo,
            origem: segmento.origem,
            destino: segmento.destino,
            dataPartida,
            dataChegada: new Date(segmento.dataChegada),
            assentosDisponiveis: ASSENTOS_DISPONIVEIS_PADRAO,
            preco: precoPorTrecho,
          }));

        trechos.push({
          vooId: voo.id,
          direcao: slice.direcao,
          ordem: indice + 1,
          voo,
        });
      }
    }

    return trechos;
  }
}
