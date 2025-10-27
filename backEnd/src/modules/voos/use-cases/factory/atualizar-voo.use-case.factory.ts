import { Injectable } from '@nestjs/common';
import { AtualizarVooUseCase } from '../atualizar-voo.use-case';
import { VooRepository } from '../../repositories/voo.repository';

@Injectable()
export class AtualizarVooUseCaseFactory {
  constructor(private readonly vooRepository: VooRepository) {}

  create(): AtualizarVooUseCase {
    return new AtualizarVooUseCase(this.vooRepository);
  }
}