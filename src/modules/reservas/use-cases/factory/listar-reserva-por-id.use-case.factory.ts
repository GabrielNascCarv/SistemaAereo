import { Injectable } from '@nestjs/common';
import { ListarReservaPorIdUseCase } from '../listar-reserva-por-id.use-case';
import { ReservaRepository } from '../../repositories/reserva.repository';

@Injectable()
export class ListarReservaPorIdUseCaseFactory {
  constructor(private readonly reservaRepository: ReservaRepository) {}

  create(): ListarReservaPorIdUseCase {
    return new ListarReservaPorIdUseCase(this.reservaRepository);
  }
}
