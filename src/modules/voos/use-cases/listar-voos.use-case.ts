import { Injectable } from '@nestjs/common';
import type { ListarVoosUseCaseContract } from '../contracts/listar-voos-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class ListarVoosUseCase implements ListarVoosUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    return await this.vooRepository.findAll({ skip, take: params.limit });
  }
}
