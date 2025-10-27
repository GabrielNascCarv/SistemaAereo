import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import type { CriarVooUseCaseContract } from '../contracts/criar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class CriarVooUseCase implements CriarVooUseCaseContract {
  constructor(
    private readonly vooRepository: VooRepository,
  ) {}

  async execute(data: {
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: string;
    dataChegada: string;
    assentosDisponiveis: number;
    preco: number;
    status?: string;
  }) {
    const vooExistente = await this.vooRepository.findByNumeroVoo(data.numeroVoo);
    if (vooExistente) {
      throw new ConflictException('Número do voo já cadastrado');
    }

    const dataPartida = new Date(data.dataPartida);
    const dataChegada = new Date(data.dataChegada);
    
    if (dataPartida >= dataChegada) {
      throw new BadRequestException('Data de partida deve ser anterior à data de chegada');
    }

    const agora = new Date();
    if (dataPartida <= agora) {
      throw new BadRequestException('Data de partida não pode ser no passado');
    }

    const voo = await this.vooRepository.create({
      numeroVoo: data.numeroVoo,
      origem: data.origem,
      destino: data.destino,
      dataPartida,
      dataChegada,
      assentosDisponiveis: data.assentosDisponiveis,
      preco: data.preco,
      status: data.status || 'AGENDADO',
    });

    return voo;
  }
}
