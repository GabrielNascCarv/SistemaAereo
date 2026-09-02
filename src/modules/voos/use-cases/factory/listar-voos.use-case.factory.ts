import { Injectable } from '@nestjs/common';
import { ListarVoosUseCase } from '../listar-voos.use-case';
import { VooRepository } from '../../repositories/voo.repository';

@Injectable()
export class ListarVoosUseCaseFactory {
  constructor(private readonly vooRepository: VooRepository) {}

  create(): ListarVoosUseCase {
    return new ListarVoosUseCase(this.vooRepository);
  }
}
