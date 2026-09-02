import { Inject, Injectable } from '@nestjs/common';
import type { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';
import { BUSCA_VOOS_GATEWAY } from '../voos-externos.tokens';

@Injectable()
export class BuscarOfertasVooUseCase {
  constructor(
    @Inject(BUSCA_VOOS_GATEWAY)
    private readonly gateway: BuscaVoosGatewayContract,
  ) {}

  async execute(params: {
    origem: string;
    destino: string;
    dataIda: string;
    dataVolta?: string;
  }): Promise<OfertaVooDto[]> {
    return this.gateway.buscarOfertas(params);
  }
}
