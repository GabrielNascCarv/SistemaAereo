import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { BUSCA_VOOS_GATEWAY } from '../voos-externos.tokens';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { VooEntity } from '../../voos/entities/voo.entity';

@Injectable()
export class ImportarVooExternoUseCase {
  constructor(
    @Inject(BUSCA_VOOS_GATEWAY)
    private readonly gateway: BuscaVoosGatewayContract,
    private readonly vooRepository: VooRepository,
  ) {}

  async execute(ofertaId: string): Promise<VooEntity> {
    const oferta = await this.gateway.buscarOfertaPorId(ofertaId);
    if (!oferta) {
      throw new NotFoundException('Oferta de voo não encontrada');
    }

    // Idempotente: se esse voo (mesmo número) já foi importado por uma
    // busca anterior, reaproveita o registro em vez de duplicar.
    const vooJaImportado = await this.vooRepository.findByNumeroVoo(
      oferta.numeroVoo,
    );
    if (vooJaImportado) {
      return vooJaImportado;
    }

    return this.vooRepository.create({
      numeroVoo: oferta.numeroVoo,
      origem: oferta.origem,
      destino: oferta.destino,
      dataPartida: new Date(oferta.dataPartida),
      dataChegada: new Date(oferta.dataChegada),
      // MVP: uma oferta da Duffel representa 1 assento reservável nessa
      // busca específica, não a lotação real do avião.
      assentosDisponiveis: 1,
      preco: oferta.preco,
    });
  }
}
