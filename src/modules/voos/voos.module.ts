import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { VooController } from './controllers/voo.controller';
import { VooControllerFactory } from './controllers/voo.controller.factory';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';
import { CriarVooUseCaseFactory } from './use-cases/factory/criar-voo.use-case.factory'

@Module({
  imports: [DatabaseModule],
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
