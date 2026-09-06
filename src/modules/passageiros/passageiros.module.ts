import { Module } from '@nestjs/common';
import { PassageiroController } from './controllers/passageiro.controller';
import { PassageiroRepository } from './repositories/passageiro.repository';
import { CriarPassageiroUseCase } from './use-cases/criar-passageiro.use-case';
import { ListarPassageirosUseCase } from './use-cases/listar-passageiros.use-case';
import { ListarPassageiroPorIdUseCase } from './use-cases/listar-passageiro-por-id.use-case';
import { AtualizarPassageiroUseCase } from './use-cases/atualizar-passageiro.use-case';
import { DeletarPassageiroUseCase } from './use-cases/deletar-passageiro.use-case';

@Module({
  controllers: [PassageiroController],
  providers: [
    PassageiroRepository,
    CriarPassageiroUseCase,
    ListarPassageirosUseCase,
    ListarPassageiroPorIdUseCase,
    AtualizarPassageiroUseCase,
    DeletarPassageiroUseCase,
  ],
  exports: [PassageiroRepository],
})
export class PassageirosModule {}
