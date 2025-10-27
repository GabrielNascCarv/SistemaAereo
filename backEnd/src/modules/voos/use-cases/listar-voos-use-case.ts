import { Injectable } from '@nestjs/common';
import type { ListarVooUseCaseContract } from '../contracts/listar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class ListarVooUseCase implements ListarVooUseCaseContract {
    constructor(private readonly vooRepository: VooRepository) {}

    async execute() {
        return await this.vooRepository.findAll();
    }
}