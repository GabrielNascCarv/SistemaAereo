import { Injectable } from "@nestjs/common";
import { CriarReservaUseCaseContract } from "../contracts/criar-reserva-use-case.contract";
import { ReservaEntity } from "../entities/reserva.entity";
import { ReservaRepository } from "../repositories/reserva.repository";

@Injectable()
export class CriarReservaUseCase implements CriarReservaUseCaseContract {
  constructor(private readonly repository: ReservaRepository) {}

  async execute(data: {
    codigoReserva: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
  }): Promise<ReservaEntity> {
    // Validações de negócio aqui (se necessário)
    return await this.repository.create(data);
  }
}