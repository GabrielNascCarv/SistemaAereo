import { Injectable } from '@nestjs/common';
import { AtualizarPassageiroUseCase } from '../atualizar-passageiro.use-case';
import { PassageiroRepository } from '../../repositories/passageiro.repository';

@Injectable()
export class AtualizarPassageiroUseCaseFactory {
  constructor(
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  create(): AtualizarPassageiroUseCase {
    return new AtualizarPassageiroUseCase(this.passageiroRepository);
  }
}
