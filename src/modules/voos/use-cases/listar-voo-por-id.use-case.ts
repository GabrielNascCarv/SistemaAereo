import { Injectable } from '@nestjs/common';
import type { ListarVooPorIdUseCaseContract } from '../contracts/listar-voo-por-id-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class ListarVooPorIdUseCase implements ListarVooPorIdUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(id: number) {
    return await this.vooRepository.findById(id);
  }
}
