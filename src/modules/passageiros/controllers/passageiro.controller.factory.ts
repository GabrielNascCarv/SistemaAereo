import { Injectable } from '@nestjs/common';
import { PassageiroController } from './passageiro.controller';
import { CriarPassageiroUseCaseFactory } from '../use-cases/factory/criar-passageiro.use-case.factory';
import { ListarPassageirosUseCaseFactory } from '../use-cases/factory/listar-passageiros.use-case.factory';
import { ListarPassageiroPorIdUseCaseFactory } from '../use-cases/factory/listar-passageiro-por-id.use-case.factory';
import { AtualizarPassageiroUseCaseFactory } from '../use-cases/factory/atualizar-passageiro.use-case.factory';
import { DeletarPassageiroUseCaseFactory } from '../use-cases/factory/deletar-passageiro.use-case.factory';

@Injectable()
export class PassageiroControllerFactory {
  constructor(
    private readonly criarPassageiroUseCaseFactory: CriarPassageiroUseCaseFactory,
    private readonly listarPassageirosUseCaseFactory: ListarPassageirosUseCaseFactory,
    private readonly listarPassageiroPorIdUseCaseFactory: ListarPassageiroPorIdUseCaseFactory,
    private readonly atualizarPassageiroUseCaseFactory: AtualizarPassageiroUseCaseFactory,
    private readonly deletarPassageiroUseCaseFactory: DeletarPassageiroUseCaseFactory,
  ) {}

  create(): PassageiroController {
    const criarPassageiroUseCase = this.criarPassageiroUseCaseFactory.create();
    const listarPassageirosUseCase =
      this.listarPassageirosUseCaseFactory.create();
    const listarPassageiroPorIdUseCase =
      this.listarPassageiroPorIdUseCaseFactory.create();
    const atualizarPassageiroUseCase =
      this.atualizarPassageiroUseCaseFactory.create();
    const deletarPassageiroUseCase =
      this.deletarPassageiroUseCaseFactory.create();
    return new PassageiroController(
      criarPassageiroUseCase,
      listarPassageirosUseCase,
      listarPassageiroPorIdUseCase,
      atualizarPassageiroUseCase,
      deletarPassageiroUseCase,
    );
  }
}
