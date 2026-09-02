import { Module } from '@nestjs/common';
import { VooController } from './controllers/voo.controller';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';
import { CriarVooUseCaseFactory } from './use-cases/factory/criar-voo.use-case.factory';
import { VooControllerFactory } from './controllers/voo.controller.factory';

@Module({
  controllers: [VooController],
  providers: [
    VooRepository,
    CriarVooUseCase,
    CriarVooUseCaseFactory,
    VooControllerFactory,
  ],
  exports: [VooRepository],
})
export class VoosModule {}
