import { Injectable } from '@nestjs/common';
import { DeletarReservaUseCase } from '../deletar-reserva.use-case';
import { ReservaRepository } from '../../repositories/reserva.repository';
import { VooRepository } from '../../../voos/repositories/voo.repository';

@Injectable()
export class DeletarReservaUseCaseFactory {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
  ) {}

  create(): DeletarReservaUseCase {
    return new DeletarReservaUseCase(this.reservaRepository, this.vooRepository);
  }
}
