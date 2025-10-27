// src/modules/reservas/use-cases/criar-reserva.use-case.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CriarReservaUseCaseContract } from "../contracts/criar-reserva-use-case.contract";
import { ReservaEntity } from "../entities/reserva.entity";
import { ReservaRepository } from "../repositories/reserva.repository";
import { CriarReservaDto } from "../dto/criar-reserva.dto";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class CriarReservaUseCase implements CriarReservaUseCaseContract {
  constructor(
    private readonly repository: ReservaRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(data: CriarReservaDto): Promise<ReservaEntity> {
    // 1. Validar se o voo existe
    const voo = await this.prisma.voo.findUnique({
      where: { id: data.vooId }
    });

    if (!voo) {
      throw new NotFoundException(`Voo com ID ${data.vooId} não encontrado`);
    }

    // 2. Validar se o voo está disponível (não cancelado ou concluído)
    if (voo.status !== 'AGENDADO') {
      throw new BadRequestException(`Não é possível reservar em voo com status: ${voo.status}`);
    }

    // 3. Validar assentos disponíveis
    if (data.numeroPassageiros > voo.assentosDisponiveis) {
      throw new BadRequestException(
        `Assentos insuficientes. Disponível: ${voo.assentosDisponiveis}, Solicitado: ${data.numeroPassageiros}`
      );
    }

    // 4. Validar se o passageiro existe
    const passageiro = await this.prisma.passageiro.findUnique({
      where: { id: data.passageiroId }
    });

    if (!passageiro) {
      throw new NotFoundException(`Passageiro com ID ${data.passageiroId} não encontrado`);
    }

    // 5. Criar a reserva
    return await this.repository.create(data);
  }
}