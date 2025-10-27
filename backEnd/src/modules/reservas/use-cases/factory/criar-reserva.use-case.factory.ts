import { Injectable } from "@nestjs/common";
import { CriarReservaUseCase } from "../criar-reserva.use-case";
import { ReservaRepository } from "../../repositories/reserva.repository";

@Injectable()
export class CriarReservaUseCaseFactory {
  constructor(private readonly repository: ReservaRepository) {}

  create(): CriarReservaUseCase {
    return new CriarReservaUseCase(this.repository);
  }
}