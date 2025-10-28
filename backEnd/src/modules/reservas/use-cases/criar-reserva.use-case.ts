import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CriarReservaUseCaseContract } from "../contracts/criar-reserva-use-case.contract";
import { ReservaEntity } from "../entities/reserva.entity";
import { ReservaRepository } from "../repositories/reserva.repository";
import { CriarReservaDto } from "../dto/criar-reserva.dto";
import { VooRepository } from "../../voos/repositories/voo.repository";
import { PassageiroRepository } from "../../passageiros/repositories/passageiro.repository";
import { CriarReservaParams } from '../contracts/reserva-repository.contract';

@Injectable()
export class CriarReservaUseCase implements CriarReservaUseCaseContract {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
    private readonly passageiroRepository: PassageiroRepository
  ) {}
  
  async execute(data: CriarReservaDto): Promise<ReservaEntity> {
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

    const createData: CriarReservaParams = {
        codigoReserva: data.codigoReserva,
        numeroPassageiros: data.numeroPassageiros,
        vooId: data.vooId,
        passageiroId: data.passageiroId,
    };

    return await this.reservaRepository.create(createData);
  }
}
