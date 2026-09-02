import { Injectable } from '@nestjs/common';
import type { ListarReservaPorIdUseCaseContract } from '../contracts/listar-reserva-por-id-use-case.contract';
import { ReservaRepository } from '../repositories/reserva.repository';

@Injectable()
export class ListarReservaPorIdUseCase
  implements ListarReservaPorIdUseCaseContract
{
  constructor(private readonly reservaRepository: ReservaRepository) {}

  async execute(id: number) {
    return await this.reservaRepository.findById(id);
  }
}
