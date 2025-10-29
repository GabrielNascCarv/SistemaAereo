import { Injectable } from '@nestjs/common';
import type { IListarPassageiroPorIdUseCase } from '../contracts/listar-passageiro-por-id-use-case.contract';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class ListarPassageiroPorIdUseCase implements IListarPassageiroPorIdUseCase {
  constructor(
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  async execute(id: number) {
    return await this.passageiroRepository.findById(id);
  }
}

