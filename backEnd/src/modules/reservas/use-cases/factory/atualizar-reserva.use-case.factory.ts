import { Injectable } from "@nestjs/common";
import { AtualizarReservaUseCase } from "../atualizar-reserva.use-case";
import { ReservaRepository } from "../../repositories/reserva.repository";

@Injectable()
export class AtualizarReservaUseCaseFactory {
    constructor(
        private readonly reservaRepository: ReservaRepository,
    ) {}

    create(): AtualizarReservaUseCase {
        return new AtualizarReservaUseCase(this.reservaRepository);
    }
}