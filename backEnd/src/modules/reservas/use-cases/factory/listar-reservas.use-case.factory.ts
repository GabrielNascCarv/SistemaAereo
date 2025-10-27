import { Injectable } from '@nestjs/common';
import { ListarReservasUseCase } from '../listar-reservas.use-case';
import { ReservaRepository } from '../../repositories/reserva.repository';

@Injectable()
export class ListarReservasUseCaseFactory {
    constructor(private readonly reservaRepository: ReservaRepository) {}

    create(): ListarReservasUseCase {
        return new ListarReservasUseCase(this.reservaRepository);
    }
}