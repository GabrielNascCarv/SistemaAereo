import { Module } from '@nestjs/common';
import { VooController } from './controllers/voo.controller';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';
import { CriarVooUseCaseFactory } from './use-cases/factory/criar-voo.use-case.factory';
import { ListarVoosUseCase } from './use-cases/listar-voos.use-case';
import { ListarVoosUseCaseFactory } from './use-cases/factory/listar-voos.use-case.factory';
import { ListarVooPorIdUseCase } from './use-cases/listar-voo-por-id.use-case';
import { ListarVooPorIdUseCaseFactory } from './use-cases/factory/listar-voo-por-id.use-case.factory';
import { AtualizarVooUseCase } from './use-cases/atualizar-voo.use-case';
import { AtualizarVooUseCaseFactory } from './use-cases/factory/atualizar-voo.use-case.factory';
import { DeletarVooUseCase } from './use-cases/deletar-voo.use-case';
import { DeletarVooUseCaseFactory } from './use-cases/factory/deletar-voo.use-case.factory';
import { VooControllerFactory } from './controllers/voo.controller.factory';

@Module({
  controllers: [VooController],
  providers: [
    VooRepository,
    CriarVooUseCase,
    CriarVooUseCaseFactory,
    ListarVoosUseCase,
    ListarVoosUseCaseFactory,
    ListarVooPorIdUseCase,
    ListarVooPorIdUseCaseFactory,
    AtualizarVooUseCase,
    AtualizarVooUseCaseFactory,
    DeletarVooUseCase,
    DeletarVooUseCaseFactory,
    VooControllerFactory,
  ],
  exports: [VooRepository],
})
export class VoosModule {}
