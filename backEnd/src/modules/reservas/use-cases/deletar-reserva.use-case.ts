import { Injectable, NotFoundException } from "@nestjs/common";
import type { IDeletarPassageiroUseCase, DeletarPassageiroResult } from "src/modules/passageiros/contracts/deletar-passageiro-use-case.contract";
import { ReservaRepository } from "../repositories/reserva.repository";

@Injectable()
export class DeletarReservaUseCase implements IDeletarPassageiroUseCase {
    constructor( private readonly reservaRepository: ReservaRepository) {}

    async execute(id: number): Promise<DeletarPassageiroResult> {
        const reserva = await this.reservaRepository.findById(id);
        if (!reserva) {
            throw new NotFoundException('Reserva não encontrada');
        }
        return await this.reservaRepository.delete(id);
    }    
}