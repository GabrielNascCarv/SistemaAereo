import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ICriarReservaUseCase, TCriarReservaParams } from "../contracts/criar-reserva-use-case.contract";
import { ReservaEntity } from "../entities/reserva.entity";
import { ReservaRepository } from "../repositories/reserva.repository";
import { VooRepository } from "../../voos/repositories/voo.repository";
import { PassageiroRepository } from "../../passageiros/repositories/passageiro.repository";

@Injectable()
export class CriarReservaUseCase implements ICriarReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
    private readonly passageiroRepository: PassageiroRepository
  ) {}
  
  async execute(data: TCriarReservaParams): Promise<ReservaEntity> {
    const voo = await this.vooRepository.findById(data.vooId);

    if (!voo) {
      throw new NotFoundException(`Voo com ID ${data.vooId} não encontrado`);
    }

    if (voo.status !== 'AGENDADO') {
      throw new BadRequestException(`Não é possível reservar em voo com status: ${voo.status}`);
    }

    if (data.numeroPassageiros > voo.assentosDisponiveis) {
      throw new BadRequestException(
        `Assentos insuficientes. Disponível: ${voo.assentosDisponiveis}, Solicitado: ${data.numeroPassageiros}`
      );
    }

    const passageiro = await this.passageiroRepository.findById(data.passageiroId);

    if (!passageiro) {
      throw new NotFoundException(`Passageiro com ID ${data.passageiroId} não encontrado`);
    }

    const reserva = await this.reservaRepository.create(data);

    return reserva;
  }
}
