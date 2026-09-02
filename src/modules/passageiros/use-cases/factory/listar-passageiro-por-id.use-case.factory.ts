import { Injectable } from '@nestjs/common';
import { ListarPassageiroPorIdUseCase } from '../listar-passageiro-por-id.use-case';
import { PassageiroRepository } from '../../repositories/passageiro.repository';

@Injectable()
export class ListarPassageiroPorIdUseCaseFactory {
  constructor(private readonly passageiroRepository: PassageiroRepository) {}

  create(): ListarPassageiroPorIdUseCase {
    return new ListarPassageiroPorIdUseCase(this.passageiroRepository);
  }
}
