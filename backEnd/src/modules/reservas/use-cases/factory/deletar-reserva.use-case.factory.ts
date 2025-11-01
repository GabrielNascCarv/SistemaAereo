import { Injectable } from "@nestjs/common";
import { DeletarReservaUseCase } from "../deletar-reserva.use-case";
import { ReservaRepository } from "../../repositories/reserva.repository";

@Injectable()
export class DeletarReservaUseCaseFactory {
    constructor(private readonly reservaRepository: ReservaRepository) {}

    create(): DeletarReservaUseCase {
        return new DeletarReservaUseCase(this.reservaRepository);
    }
}