import { Injectable } from '@nestjs/common';
import type { ListarReservasUseCaseContract } from '../contracts/listar-reservas-use-case.contract';
import { ReservaRepository } from '../repositories/reserva.repository';

@Injectable()
export class ListarReservasUseCase implements ListarReservasUseCaseContract {
  constructor(private readonly reservaRepository: ReservaRepository) {}

  async execute(params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    return await this.reservaRepository.findAll({ skip, take: params.limit });
  }
}
