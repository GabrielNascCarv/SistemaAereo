import { Injectable } from '@nestjs/common';
import type { ListarVoosUseCaseContract } from '../contracts/listar-voos-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';
import { vooDeveSerConcluido } from '../utils/calcular-status-voo.util';

@Injectable()
export class ListarVoosUseCase implements ListarVoosUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    const { data, total } = await this.vooRepository.findAll({ skip, take: params.limit });

    const voos = await Promise.all(
      data.map(voo =>
        vooDeveSerConcluido(voo)
          ? this.vooRepository.update(voo.id, { status: 'CONCLUIDO' })
          : Promise.resolve(voo),
      ),
    );

    return { data: voos, total };
  }
}
