import { Injectable, NotFoundException } from '@nestjs/common';
import type { IDeletarVooUseCaseContract, TDeletarVooUseCaseParams } from '../contracts/deletar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class DeletarVooUseCase implements IDeletarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(params: TDeletarVooUseCaseParams): Promise<boolean> {
    const voo = await this.vooRepository.findById(params.id);
    if (!voo) {
      throw new NotFoundException('Voo não encontrado');
    }
    return await this.vooRepository.delete(params.id);
  }
}