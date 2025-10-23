import { Injectable } from '@nestjs/common';
import { CriarPassageiroUseCase } from './criar-passageiro.use-case';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class CriarPassageiroUseCaseFactory {
  constructor(private readonly passageiroRepository: PassageiroRepository) {}

  create(): CriarPassageiroUseCase {
    return new CriarPassageiroUseCase(this.passageiroRepository);
  }
}
