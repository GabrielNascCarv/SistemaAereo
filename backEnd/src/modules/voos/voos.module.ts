import { Module } from '@nestjs/common';
import { VooController } from './controllers/voo.controller';
import { VooControllerFactory } from './controllers/voo.controller.factory';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';
import { CriarVooUseCaseFactory } from './use-cases/factory/criar-voo.use-case.factory';
import { ListarVooUseCase } from './use-cases/listar-voos-use-case';
import { ListarVooUseCaseFactory } from './use-cases/factory/listar-voo.use-case.factory';
import { AtualizarVooUseCase } from './use-cases/atualizar-voo.use-case';
import { AtualizarVooUseCaseFactory } from './use-cases/factory/atualizar-voo.use-case.factory';
import { DeletarVooUseCase } from './use-cases/deletar-voo.use-case';
import { DeletarVooUseCaseFactory } from './use-cases/factory/deletar-voo.use-case.factory';

@Module({
  controllers: [VooController],
  providers: [
    VooRepository,
    CriarVooUseCase,
    CriarVooUseCaseFactory,
    ListarVooUseCase,
    ListarVooUseCaseFactory,
    AtualizarVooUseCase,
    AtualizarVooUseCaseFactory,
    VooControllerFactory,
    DeletarVooUseCase,
    DeletarVooUseCaseFactory,
  ],
  exports: [VooRepository],
})
export class VoosModule {}