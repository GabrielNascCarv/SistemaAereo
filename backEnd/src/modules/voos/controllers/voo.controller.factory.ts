import { Injectable } from '@nestjs/common';
import { VooController } from './voo.controller';
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory';
import { ListarVooUseCaseFactory } from '../use-cases/factory/listar-voo.use-case.factory';
import { AtualizarVooUseCaseFactory } from '../use-cases/factory/atualizar-voo.use-case.factory';
import { DeletarVooUseCaseFactory } from '../use-cases/factory/deletar-voo.use-case.factory';

@Injectable()
export class VooControllerFactory {
  constructor(
    private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
    private readonly listarVooUseCaseFactory: ListarVooUseCaseFactory,
    private readonly atualizarVooUseCaseFactory: AtualizarVooUseCaseFactory,
    private readonly deletarVooUseCaseFactory: DeletarVooUseCaseFactory,
  ) {}

  create(): VooController {
    const criarVooUseCase = this.criarVooUseCaseFactory.create();
    const listarVooUseCase = this.listarVooUseCaseFactory.create();
    const atualizarVooUseCase = this.atualizarVooUseCaseFactory.create();
    const deletarVooUseCase = this.deletarVooUseCaseFactory.create();
    
    return new VooController(
      criarVooUseCase,
      listarVooUseCase,
      atualizarVooUseCase,
      deletarVooUseCase,
    );
  }
}