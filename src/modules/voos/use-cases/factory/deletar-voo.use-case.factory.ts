import { Injectable } from '@nestjs/common';
import { DeletarVooUseCase } from '../deletar-voo.use-case';
import { VooRepository } from '../../repositories/voo.repository';

@Injectable()
export class DeletarVooUseCaseFactory {
  constructor(private readonly vooRepository: VooRepository) {}

  create(): DeletarVooUseCase {
    return new DeletarVooUseCase(this.vooRepository);
  }
}
