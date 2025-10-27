import { Module } from '@nestjs/common';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaRepository } from './repositories/reserva.repository';
import { CriarReservaUseCase } from './use-cases/criar-reserva.use-case';
import { ListarReservasUseCase } from './use-cases/listar-reservas.use-case';
import { CriarReservaUseCaseFactory } from './use-cases/factory/criar-reserva.use-case.factory';
import { ListarReservasUseCaseFactory } from './use-cases/factory/listar-reservas.use-case.factory';
import { ListarReservaPorIdUseCase } from './use-cases/listar-reserva-por-id.use-case';
import { ListarReservaPorIdUseCaseFactory } from './use-cases/factory/listar-reserva-por-id.use-case.factory';


@Module({
  controllers: [ReservaController],
  providers: [
    ReservaRepository,
    CriarReservaUseCase,
    ListarReservasUseCase,
    ListarReservaPorIdUseCase,
    CriarReservaUseCaseFactory,
    ListarReservasUseCaseFactory,
    ListarReservaPorIdUseCaseFactory
  ],
  exports: [ReservaRepository],
})
export class ReservasModule {}