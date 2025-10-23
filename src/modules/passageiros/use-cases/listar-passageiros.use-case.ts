import { Injectable } from '@nestjs/common';
import type { ListarPassageirosUseCaseContract } from '../contracts/listar-passageiros-use-case.contract';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class ListarPassageirosUseCase implements ListarPassageirosUseCaseContract {
    constructor(private readonly passageiroRepository: PassageiroRepository) {}

    async execute() {
        return await this.passageiroRepository.findAll();
    }
}