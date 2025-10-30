import { Injectable, NotFoundException } from '@nestjs/common';
import type { IListarReservaPorIdUseCase } from '../contracts/listar-reserva-por-id-use-case.contract';
import { ReservaRepository } from '../repositories/reserva.repository';

@Injectable()
export class ListarReservaPorIdUseCase implements IListarReservaPorIdUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
  ) {}

  async execute(id: number) {
    const reserva = await this.reservaRepository.findById(id);
    
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }
    
    return reserva;
  }
}