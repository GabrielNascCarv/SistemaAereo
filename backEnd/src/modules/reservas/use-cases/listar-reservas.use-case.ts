import { Injectable } from "@nestjs/common";
import type { IListarReservasUseCase } from "../contracts/listar-reservas-use-case.contract";
import { ReservaRepository } from "../repositories/reserva.repository";

@Injectable()
export class ListarReservasUseCase implements IListarReservasUseCase {
    constructor(private readonly reservaRepository: ReservaRepository) {}

    async execute() {
        return await this.reservaRepository.findAll();
    }
}