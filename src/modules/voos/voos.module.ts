import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { VooController } from './controllers/voo.controller';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [VooController],
  providers: [
    VooRepository,
    CriarVooUseCase,
  ],
  exports: [VooRepository],
})
export class VoosModule {}
