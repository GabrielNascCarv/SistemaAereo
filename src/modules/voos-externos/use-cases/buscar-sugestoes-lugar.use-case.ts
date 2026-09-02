import { Inject, Injectable } from '@nestjs/common';
import type { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { SugestaoLugarDto } from '../dto/sugestao-lugar.dto';
import { BUSCA_VOOS_GATEWAY } from '../voos-externos.tokens';

@Injectable()
export class BuscarSugestoesLugarUseCase {
  constructor(
    @Inject(BUSCA_VOOS_GATEWAY)
    private readonly gateway: BuscaVoosGatewayContract,
  ) {}

  async execute(query: string): Promise<SugestaoLugarDto[]> {
    return this.gateway.buscarSugestoesLugar(query);
  }
}
