import { Injectable, NotFoundException } from '@nestjs/common';
import type { AtualizarVooUseCaseContract } from '../contracts/atualizar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class AtualizarVooUseCase implements AtualizarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(id: number, data: {
    numeroVoo?: string;
    origem?: string;
    destino?: string;
    dataPartida?: Date;
    dataChegada?: Date;
    assentosDisponiveis?: number;
    preco?: number;
    status?: string;
  }) {
    // Verificar se o voo existe
    const vooExistente = await this.vooRepository.findById(id);
    if (!vooExistente) {
      throw new NotFoundException('Voo não encontrado');
    }

    // Atualizar o voo
    const voo = await this.vooRepository.update(id, data);
    return voo;
  }
}