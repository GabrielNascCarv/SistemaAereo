import { Injectable } from '@nestjs/common';
import type { ListarPassageirosUseCaseContract } from '../contracts/listar-passageiros-use-case.contract';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class ListarPassageirosUseCase implements ListarPassageirosUseCaseContract {
    constructor(private readonly passageiroRepository: PassageiroRepository) {}

    async execute(params: { page: number; limit: number }) {
        const skip = (params.page - 1) * params.limit;
        return await this.passageiroRepository.findAll({ skip, take: params.limit });
    }
}