import { Injectable } from '@nestjs/common';
import { PassageiroController } from './passageiro.controller';
import { CriarPassageiroUseCaseFactory } from '../use-cases/criar-passageiro.use-case.factory';

@Injectable()
export class PassageiroControllerFactory {
  constructor(
    private readonly criarPassageiroUseCaseFactory: CriarPassageiroUseCaseFactory,
  ) {}

  create(): PassageiroController {
    const criarPassageiroUseCase = this.criarPassageiroUseCaseFactory.create();
    return new PassageiroController(criarPassageiroUseCase);
  }
}
