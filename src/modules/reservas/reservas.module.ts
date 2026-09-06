import { Module } from '@nestjs/common';
import { VoosModule } from '../voos/voos.module';
import { PassageirosModule } from '../passageiros/passageiros.module';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaRepository } from './repositories/reserva.repository';
import { CriarReservaUseCase } from './use-cases/criar-reserva.use-case';
import { ListarReservasUseCase } from './use-cases/listar-reservas.use-case';
import { ListarReservaPorIdUseCase } from './use-cases/listar-reserva-por-id.use-case';
import { AtualizarReservaUseCase } from './use-cases/atualizar-reserva.use-case';
import { DeletarReservaUseCase } from './use-cases/deletar-reserva.use-case';

@Module({
  imports: [VoosModule, PassageirosModule],
  controllers: [ReservaController],
  providers: [
    ReservaRepository,
    CriarReservaUseCase,
    ListarReservasUseCase,
    ListarReservaPorIdUseCase,
    AtualizarReservaUseCase,
    DeletarReservaUseCase,
  ],
  exports: [ReservaRepository],
})
export class ReservasModule {}
