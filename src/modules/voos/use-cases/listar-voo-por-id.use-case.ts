import { Injectable } from '@nestjs/common';
import type { ListarVooPorIdUseCaseContract } from '../contracts/listar-voo-por-id-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';
import { vooDeveSerConcluido } from '../utils/calcular-status-voo.util';

@Injectable()
export class ListarVooPorIdUseCase implements ListarVooPorIdUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(id: number) {
    const voo = await this.vooRepository.findById(id);
    if (!voo) {
      return null;
    }

    if (vooDeveSerConcluido(voo)) {
      return await this.vooRepository.update(id, { status: 'CONCLUIDO' });
    }

    return voo;
  }
}
