import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import type { ICriarVooUseCaseContract, TCriarVooUseCaseParams } from '../contracts/criar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';
import { VooEntity } from '../entities/voo.entity';

@Injectable()
export class CriarVooUseCase implements ICriarVooUseCaseContract {
  constructor(
    private readonly vooRepository: VooRepository,
  ) {}

  async execute(params: TCriarVooUseCaseParams): Promise<VooEntity> {
    const vooExistente = await this.vooRepository.findByNumeroVoo(params.numeroVoo);
    if (vooExistente) {
      throw new ConflictException('Número do voo já cadastrado');
    }

    const dataPartida = new Date(params.dataPartida);
    const dataChegada = new Date(params.dataChegada);
    
    if (dataPartida >= dataChegada) {
      throw new BadRequestException('Data de partida deve ser anterior à data de chegada');
    }

    const agora = new Date();
    if (dataPartida <= agora) {
      throw new BadRequestException('Data de partida não pode ser no passado');
    }

    const voo = await this.vooRepository.create({
      numeroVoo: params.numeroVoo,
      origem: params.origem,
      destino: params.destino,
      dataPartida,
      dataChegada,
      assentosDisponiveis: params.assentosDisponiveis,
      preco: params.preco,
      status: params.status || 'AGENDADO',
    });

    return voo;
  }
}