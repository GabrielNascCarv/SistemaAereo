import { Injectable } from '@nestjs/common';
import { ListarPassageirosUseCase } from '../listar-passageiros.use-case';
import { PassageiroRepository } from '../../repositories/passageiro.repository';

@Injectable()
export class ListarPassageirosUseCaseFactory {
    constructor(private readonly passageiroRepository: PassageiroRepository) {}

    create(): ListarPassageirosUseCase {
        return new ListarPassageirosUseCase(this.passageiroRepository);
    }
}