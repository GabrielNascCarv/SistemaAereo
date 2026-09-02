import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { AtualizarReservaUseCaseContract } from '../contracts/atualizar-reserva-use-case.contract';
import { ReservaRepository } from '../repositories/reserva.repository';
import { VooRepository } from '../../voos/repositories/voo.repository';

@Injectable()
export class AtualizarReservaUseCase implements AtualizarReservaUseCaseContract {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
  ) {}

  async execute(id: number, data: {
    status?: string;
    numeroPassageiros?: number;
  }) {
    const reservaExistente = await this.reservaRepository.findById(id);
    if (!reservaExistente) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservaExistente.status === 'CANCELADA') {
      throw new BadRequestException('Reserva cancelada não pode ser alterada');
    }

    const voo = await this.vooRepository.findById(reservaExistente.vooId);
    if (!voo) {
      throw new NotFoundException('Voo não encontrado');
    }

    if (data.status === 'CANCELADA') {
      await this.vooRepository.update(voo.id, {
        assentosDisponiveis: voo.assentosDisponiveis + reservaExistente.numeroPassageiros,
      });
    } else if (
      data.numeroPassageiros !== undefined &&
      data.numeroPassageiros !== reservaExistente.numeroPassageiros
    ) {
      const diferenca = data.numeroPassageiros - reservaExistente.numeroPassageiros;
      if (diferenca > voo.assentosDisponiveis) {
        throw new BadRequestException('Assentos disponíveis insuficientes para este voo');
      }
      await this.vooRepository.update(voo.id, {
        assentosDisponiveis: voo.assentosDisponiveis - diferenca,
      });
    }

    const reserva = await this.reservaRepository.update(id, data);
    return reserva;
  }
}
