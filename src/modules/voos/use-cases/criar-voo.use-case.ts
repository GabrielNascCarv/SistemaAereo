import { Injectable, ConflictException } from '@nestjs/common';
import type { CriarVooUseCaseContract } from '../contracts/criar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class CriarVooUseCase implements CriarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(data: {
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status?: string;
  }) {
    // Verificar se já existe um voo com esse número nessa data de partida
    const vooExistente = await this.vooRepository.findByNumeroVoo(
      data.numeroVoo,
      data.dataPartida,
    );
    if (vooExistente) {
      throw new ConflictException(
        'Já existe um voo com esse número nessa data de partida',
      );
    }

    const voo = await this.vooRepository.create(data);

    return voo;
  }
}
