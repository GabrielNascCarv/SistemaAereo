import { Injectable } from '@nestjs/common';
import { ListarVooUseCase } from '../listar-voos-use-case';
import { VooRepository } from '../../repositories/voo.repository';

@Injectable()
export class ListarVooUseCaseFactory {
  constructor(private readonly vooRepository: VooRepository) {}

  create(): ListarVooUseCase {
    return new ListarVooUseCase(this.vooRepository);
  }
}