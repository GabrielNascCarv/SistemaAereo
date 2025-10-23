import { Module } from '@nestjs/common';
import { PassageiroController } from './controllers/passageiro.controller';
import { PassageiroRepository } from './repositories/passageiro.repository';
import { CriarPassageiroUseCase } from './use-cases/criar-passageiro.use-case';
import { CriarPassageiroUseCaseFactory } from './use-cases/criar-passageiro.use-case.factory';
import { ListarPassageirosUseCase } from './use-cases/listar-passageiros.use-case';
import { ListarPassageirosUseCaseFactory } from './use-cases/listar-passageiros.use-case.factory';
import { PassageiroControllerFactory } from './controllers/passageiro.controller.factory';

@Module({
  controllers: [PassageiroController],
  providers: [
    PassageiroRepository,
    CriarPassageiroUseCase,
    CriarPassageiroUseCaseFactory,
    ListarPassageirosUseCase,
    ListarPassageirosUseCaseFactory,
    PassageiroControllerFactory,
  ],
  exports: [PassageiroRepository],
})
export class PassageirosModule {}
