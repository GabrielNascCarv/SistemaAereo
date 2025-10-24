import { Module } from '@nestjs/common';
import { PassageiroController } from './controllers/passageiro.controller';
import { PassageiroRepository } from './repositories/passageiro.repository';
import { CriarPassageiroUseCase } from './use-cases/criar-passageiro.use-case';
import { CriarPassageiroUseCaseFactory } from './use-cases/factory/criar-passageiro.use-case.factory';
import { ListarPassageirosUseCase } from './use-cases/listar-passageiros.use-case';
import { ListarPassageirosUseCaseFactory } from './use-cases/factory/listar-passageiros.use-case.factory';
import { ListarPassageiroPorIdUseCase } from './use-cases/listar-passageiro-por-id.use-case';
import { ListarPassageiroPorIdUseCaseFactory } from './use-cases/factory/listar-passageiro-por-id.use-case.factory';
import { AtualizarPassageiroUseCase } from './use-cases/atualizar-passageiro.use-case';
import { AtualizarPassageiroUseCaseFactory } from './use-cases/factory/atualizar-passageiro.use-case.factory';
import { PassageiroControllerFactory } from './controllers/passageiro.controller.factory';
import { DeletarPassageiroUseCase } from './use-cases/deletar-passageiro.use-case';
import { DeletarPassageiroUseCaseFactory } from './use-cases/factory/deletar-passageiro.use-case.factory';

@Module({
  controllers: [PassageiroController],
  providers: [
    PassageiroRepository,
    CriarPassageiroUseCase,
    CriarPassageiroUseCaseFactory,
    ListarPassageirosUseCase,
    ListarPassageirosUseCaseFactory,
    ListarPassageiroPorIdUseCase,
    ListarPassageiroPorIdUseCaseFactory,
    AtualizarPassageiroUseCase,
    AtualizarPassageiroUseCaseFactory,
    DeletarPassageiroUseCase,
    DeletarPassageiroUseCaseFactory,
    PassageiroControllerFactory,
  ],
  exports: [PassageiroRepository],
})
export class PassageirosModule {}
