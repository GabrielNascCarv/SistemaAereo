import { Module } from '@nestjs/common';
import { VooController } from './controllers/voo.controller';
import { VooRepository } from './repositories/voo.repository';
import { CriarVooUseCase } from './use-cases/criar-voo.use-case';
import { ListarVoosUseCase } from './use-cases/listar-voos.use-case';
import { ListarVooPorIdUseCase } from './use-cases/listar-voo-por-id.use-case';
import { AtualizarVooUseCase } from './use-cases/atualizar-voo.use-case';
import { DeletarVooUseCase } from './use-cases/deletar-voo.use-case';

@Module({
  controllers: [VooController],
  providers: [
    VooRepository,
    CriarVooUseCase,
    ListarVoosUseCase,
    ListarVooPorIdUseCase,
    AtualizarVooUseCase,
    DeletarVooUseCase,
  ],
  exports: [VooRepository],
})
export class VoosModule {}
