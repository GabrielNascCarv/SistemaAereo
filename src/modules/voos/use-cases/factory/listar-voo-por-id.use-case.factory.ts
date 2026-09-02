import { Injectable } from '@nestjs/common';
import { ListarVooPorIdUseCase } from '../listar-voo-por-id.use-case';
import { VooRepository } from '../../repositories/voo.repository';

@Injectable()
export class ListarVooPorIdUseCaseFactory {
  constructor(private readonly vooRepository: VooRepository) {}

  create(): ListarVooPorIdUseCase {
    return new ListarVooPorIdUseCase(this.vooRepository);
  }
}
