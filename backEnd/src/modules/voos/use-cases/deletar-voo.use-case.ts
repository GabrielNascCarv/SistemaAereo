import { Injectable, NotFoundException } from '@nestjs/common';
import type { DeletarVooUseCaseContract } from '../contracts/deletar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class DeletarVooUseCase implements DeletarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(id: number): Promise<boolean> {
    const voo = await this.vooRepository.findById(id);
    if (!voo) {
      throw new NotFoundException('Voo não encontrado');
    }
    return await this.vooRepository.delete(id);
  }
}