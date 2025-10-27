// src/modules/reservas/reservas.module.ts
import { Module } from '@nestjs/common';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaRepository } from './repositories/reserva.repository';
import { CriarReservaUseCase } from './use-cases/criar-reserva.use-case';
import { CriarReservaUseCaseFactory } from './use-cases/factory/criar-reserva.use-case.factory';
import { ReservaControllerFactory } from './controllers/reserva.controller.factory';


@Module({
  controllers: [ReservaController],
  providers: [
    ReservaRepository,
    CriarReservaUseCase,
    CriarReservaUseCaseFactory,
    ReservaControllerFactory
  ],
  exports: [ReservaRepository],
})
export class ReservasModule {}