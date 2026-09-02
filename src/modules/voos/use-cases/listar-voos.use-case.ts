import { Injectable } from '@nestjs/common';
import type { ListarVoosUseCaseContract } from '../contracts/listar-voos-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class ListarVoosUseCase implements ListarVoosUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute() {
    return await this.vooRepository.findAll();
  }
}
