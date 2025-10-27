import { Injectable } from "@nestjs/common";
import { CriarReservaUseCase } from "../criar-reserva.use-case";
import { ReservaRepository } from "../../repositories/reserva.repository";
import { PrismaService } from "../../../../core/database/prisma.service";

@Injectable()
export class CriarReservaUseCaseFactory {
  constructor(
    private readonly repository: ReservaRepository,
    private readonly prisma: PrismaService
  ) {}

  create(): CriarReservaUseCase {
    return new CriarReservaUseCase(this.repository, this.prisma);
  }
}