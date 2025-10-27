import { Injectable } from '@nestjs/common';
import { VooController } from './voo.controller'
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory'
import { ListarVooUseCaseFactory } from '../use-cases/factory/listar-voo.use-case.factory'

@Injectable()
export class VooControllerFactory {
    constructor(
        private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
        private readonly listarVooUseCaseFactory: ListarVooUseCaseFactory,
    ){}

    create(): VooController {
        const criarVooUseCase = this.criarVooUseCaseFactory.create();
        const listarVooUseCase = this.listarVooUseCaseFactory.create();
        return new VooController(
            criarVooUseCase,
            listarVooUseCase,
        )
    }
}