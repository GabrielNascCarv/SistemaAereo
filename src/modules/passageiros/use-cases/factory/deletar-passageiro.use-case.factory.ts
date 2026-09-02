import { Injectable } from '@nestjs/common';
import { DeletarPassageiroUseCase } from '../deletar-passageiro.use-case';
import { PassageiroRepository } from '../../repositories/passageiro.repository';

@Injectable()
export class DeletarPassageiroUseCaseFactory {
  constructor(private readonly passageiroRepository: PassageiroRepository) {}

  create(): DeletarPassageiroUseCase {
    return new DeletarPassageiroUseCase(this.passageiroRepository);
  }
}
