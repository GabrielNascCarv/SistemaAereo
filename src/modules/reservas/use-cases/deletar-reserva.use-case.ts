import { Injectable, NotFoundException } from '@nestjs/common';
import type { DeletarReservaUseCaseContract } from '../contracts/deletar-reserva-use-case.contract';
import { ReservaRepository } from '../repositories/reserva.repository';
import { VooRepository } from '../../voos/repositories/voo.repository';

@Injectable()
export class DeletarReservaUseCase implements DeletarReservaUseCaseContract {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    const sucesso = await this.reservaRepository.delete(id);

    if (sucesso && reserva.status !== 'CANCELADA') {
      const voo = await this.vooRepository.findById(reserva.vooId);
      if (voo) {
        await this.vooRepository.update(voo.id, {
          assentosDisponiveis:
            voo.assentosDisponiveis + reserva.numeroPassageiros,
        });
      }
    }

    return sucesso;
  }
}
