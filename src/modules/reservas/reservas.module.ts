import { Module } from '@nestjs/common';
import { VoosModule } from '../voos/voos.module';
import { PassageirosModule } from '../passageiros/passageiros.module';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaRepository } from './repositories/reserva.repository';
import { CriarReservaUseCase } from './use-cases/criar-reserva.use-case';
import { CriarReservaUseCaseFactory } from './use-cases/factory/criar-reserva.use-case.factory';
import { ReservaControllerFactory } from './controllers/reserva.controller.factory';

@Module({
  imports: [VoosModule, PassageirosModule],
  controllers: [ReservaController],
  providers: [
    ReservaRepository,
    CriarReservaUseCase,
    CriarReservaUseCaseFactory,
    ReservaControllerFactory,
  ],
  exports: [ReservaRepository],
})
export class ReservasModule {}
