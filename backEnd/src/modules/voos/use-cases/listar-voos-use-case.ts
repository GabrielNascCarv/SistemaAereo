import { Injectable } from '@nestjs/common';
import type { IListarVooUseCaseContract } from '../contracts/listar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class ListarVooUseCase implements IListarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute() {
    return await this.vooRepository.findAll();
  }
}