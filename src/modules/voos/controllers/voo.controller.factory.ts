import { Injectable } from '@nestjs/common';
import { VooController } from './voo.controller';
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory';
import { ListarVoosUseCaseFactory } from '../use-cases/factory/listar-voos.use-case.factory';

@Injectable()
export class VooControllerFactory {
  constructor(
    private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
    private readonly listarVoosUseCaseFactory: ListarVoosUseCaseFactory,
  ) {}

  create(): VooController {
    const criarVooUseCase = this.criarVooUseCaseFactory.create();
    const listarVoosUseCase = this.listarVoosUseCaseFactory.create();
    return new VooController(criarVooUseCase, listarVoosUseCase);
  }
}
