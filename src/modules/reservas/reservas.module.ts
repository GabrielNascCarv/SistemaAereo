import { Module } from '@nestjs/common';
import { VoosModule } from '../voos/voos.module';
import { PassageirosModule } from '../passageiros/passageiros.module';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaRepository } from './repositories/reserva.repository';
import { CriarReservaUseCase } from './use-cases/criar-reserva.use-case';
import { CriarReservaUseCaseFactory } from './use-cases/factory/criar-reserva.use-case.factory';
import { ListarReservasUseCase } from './use-cases/listar-reservas.use-case';
import { ListarReservasUseCaseFactory } from './use-cases/factory/listar-reservas.use-case.factory';
import { ListarReservaPorIdUseCase } from './use-cases/listar-reserva-por-id.use-case';
import { ListarReservaPorIdUseCaseFactory } from './use-cases/factory/listar-reserva-por-id.use-case.factory';
import { ReservaControllerFactory } from './controllers/reserva.controller.factory';

@Module({
  imports: [VoosModule, PassageirosModule],
  controllers: [ReservaController],
  providers: [
    ReservaRepository,
    CriarReservaUseCase,
    CriarReservaUseCaseFactory,
    ListarReservasUseCase,
    ListarReservasUseCaseFactory,
    ListarReservaPorIdUseCase,
    ListarReservaPorIdUseCaseFactory,
    ReservaControllerFactory,
  ],
  exports: [ReservaRepository],
})
export class ReservasModule {}
