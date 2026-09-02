import { Injectable } from '@nestjs/common';
import { VooController } from './voo.controller';
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory';
import { ListarVoosUseCaseFactory } from '../use-cases/factory/listar-voos.use-case.factory';
import { ListarVooPorIdUseCaseFactory } from '../use-cases/factory/listar-voo-por-id.use-case.factory';
import { AtualizarVooUseCaseFactory } from '../use-cases/factory/atualizar-voo.use-case.factory';

@Injectable()
export class VooControllerFactory {
  constructor(
    private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
    private readonly listarVoosUseCaseFactory: ListarVoosUseCaseFactory,
    private readonly listarVooPorIdUseCaseFactory: ListarVooPorIdUseCaseFactory,
    private readonly atualizarVooUseCaseFactory: AtualizarVooUseCaseFactory,
  ) {}

  create(): VooController {
    const criarVooUseCase = this.criarVooUseCaseFactory.create();
    const listarVoosUseCase = this.listarVoosUseCaseFactory.create();
    const listarVooPorIdUseCase = this.listarVooPorIdUseCaseFactory.create();
    const atualizarVooUseCase = this.atualizarVooUseCaseFactory.create();
    return new VooController(criarVooUseCase, listarVoosUseCase, listarVooPorIdUseCase, atualizarVooUseCase);
  }
}
