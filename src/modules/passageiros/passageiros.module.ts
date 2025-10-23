import { Module } from '@nestjs/common';
import { PassageiroController } from './controllers/passageiro.controller';
import { PassageiroRepository } from './repositories/passageiro.repository';
import { CriarPassageiroUseCase } from './use-cases/criar-passageiro.use-case';

@Module({
  controllers: [PassageiroController],
  providers: [
    PassageiroRepository,
    CriarPassageiroUseCase,
  ],
  exports: [PassageiroRepository],
})
export class PassageirosModule {}
