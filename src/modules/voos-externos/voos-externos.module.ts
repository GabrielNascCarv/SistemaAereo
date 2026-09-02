import { Module } from '@nestjs/common';
import { VoosModule } from '../voos/voos.module';
import { VoosExternosController } from './controllers/voos-externos.controller';
import { DuffelGateway } from './gateways/duffel.gateway';
import { BuscarOfertasVooUseCase } from './use-cases/buscar-ofertas-voo.use-case';
import { ImportarVooExternoUseCase } from './use-cases/importar-voo-externo.use-case';
import { BUSCA_VOOS_GATEWAY } from './voos-externos.tokens';

@Module({
  imports: [VoosModule],
  controllers: [VoosExternosController],
  providers: [
    { provide: BUSCA_VOOS_GATEWAY, useClass: DuffelGateway },
    BuscarOfertasVooUseCase,
    ImportarVooExternoUseCase,
  ],
})
export class VoosExternosModule {}
