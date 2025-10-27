import { Module } from '@nestjs/common';
import { VooController } from './controllers/voo.controller';
import { VooControllerFactory } from './controllers/voo.controller.factory';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';
import { CriarVooUseCaseFactory } from './use-cases/factory/criar-voo.use-case.factory';
import { ListarVooUseCase } from './use-cases/listar-voos-use-case';
import { ListarVooUseCaseFactory } from './use-cases/factory/listar-voo.use-case.factory';

@Module({
  controllers: [VooController],
  providers: [
    VooRepository,
    CriarVooUseCase,
    CriarVooUseCaseFactory,
    VooControllerFactory, 
    ListarVooUseCase,
    ListarVooUseCaseFactory,
  ],
  exports: [VooRepository],
})
export class VoosModule {}
