import { Injectable } from '@nestjs/common';
import { AtualizarReservaUseCase } from '../atualizar-reserva.use-case';
import { ReservaRepository } from '../../repositories/reserva.repository';
import { VooRepository } from '../../../voos/repositories/voo.repository';

@Injectable()
export class AtualizarReservaUseCaseFactory {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
  ) {}

  create(): AtualizarReservaUseCase {
    return new AtualizarReservaUseCase(
      this.reservaRepository,
      this.vooRepository,
    );
  }
}
