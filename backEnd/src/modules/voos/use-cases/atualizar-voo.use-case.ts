import { Injectable, NotFoundException } from '@nestjs/common';
import type { IAtualizarVooUseCaseContract, TAtualizarVooUseCaseParams } from '../contracts/atualizar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class AtualizarVooUseCase implements IAtualizarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(id: number, params: TAtualizarVooUseCaseParams) {
    const vooExistente = await this.vooRepository.findById(id);
    if (!vooExistente) {
      throw new NotFoundException('Voo não encontrado');
    }

    const voo = await this.vooRepository.update(id, params);
    return voo;
  }
}