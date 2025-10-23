import { Injectable } from '@nestjs/common';
import { PassageiroController } from './passageiro.controller';
import { CriarPassageiroUseCaseFactory } from '../use-cases/criar-passageiro.use-case.factory';
import { ListarPassageirosUseCaseFactory } from '../use-cases/listar-passageiros.use-case.factory';

@Injectable()
export class PassageiroControllerFactory {
    constructor(
        private readonly criarPassageiroUseCaseFactory: CriarPassageiroUseCaseFactory,
        private readonly listarPassageirosUseCaseFactory: ListarPassageirosUseCaseFactory,
    ) {}

    create(): PassageiroController {
        const criarPassageiroUseCase = this.criarPassageiroUseCaseFactory.create();
        const listarPassageirosUseCase = this.listarPassageirosUseCaseFactory.create();
        return new PassageiroController(criarPassageiroUseCase, listarPassageirosUseCase);
    }
}