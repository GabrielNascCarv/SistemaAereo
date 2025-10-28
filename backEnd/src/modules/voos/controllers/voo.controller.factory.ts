import { Injectable } from '@nestjs/common';
import { VooController } from './voo.controller';
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory';
import { ListarVooUseCaseFactory } from '../use-cases/factory/listar-voo.use-case.factory';
import { AtualizarVooUseCaseFactory } from '../use-cases/factory/atualizar-voo.use-case.factory';

@Injectable()
export class VooControllerFactory {
  constructor(
    private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
    private readonly listarVooUseCaseFactory: ListarVooUseCaseFactory,
    private readonly atualizarVooUseCaseFactory: AtualizarVooUseCaseFactory,
  ) {}

  create(): VooController {
    const criarVooUseCase = this.criarVooUseCaseFactory.create();
    const listarVooUseCase = this.listarVooUseCaseFactory.create();
    const atualizarVooUseCase = this.atualizarVooUseCaseFactory.create();

    return new VooController(
      criarVooUseCase,
      listarVooUseCase,
      atualizarVooUseCase,
    );
  }
}