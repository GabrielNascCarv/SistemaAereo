import { Module } from '@nestjs/common';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaRepository } from './repositories/reserva.repository';

import { CriarReservaUseCase } from './use-cases/criar-reserva.use-case';
import { ListarReservasUseCase } from './use-cases/listar-reservas.use-case';
import { ListarReservaPorIdUseCase } from './use-cases/listar-reserva-por-id.use-case';
import { AtualizarReservaUseCase } from './use-cases/atualizar-reserva.use-case';
import { DeletarReservaUseCase } from './use-cases/deletar-reserva.use-case';

import { CriarReservaUseCaseFactory } from './use-cases/factory/criar-reserva.use-case.factory';
import { ListarReservasUseCaseFactory } from './use-cases/factory/listar-reservas.use-case.factory';
import { ListarReservaPorIdUseCaseFactory } from './use-cases/factory/listar-reserva-por-id.use-case.factory';
import { AtualizarReservaUseCaseFactory } from './use-cases/factory/atualizar-reserva.use-case.factory';
import { DeletarReservaUseCaseFactory } from './use-cases/factory/deletar-reserva.use-case.factory';

import { VoosModule } from '../voos/voos.module';
import { PassageirosModule } from '../passageiros/passageiros.module';

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
    AtualizarReservaUseCase,
    AtualizarReservaUseCaseFactory,
    DeletarReservaUseCase,
    DeletarReservaUseCaseFactory,
  ],
  exports: [ReservaRepository],
})
export class ReservasModule {}