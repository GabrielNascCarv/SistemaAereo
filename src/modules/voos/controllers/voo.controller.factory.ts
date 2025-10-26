import { Injectable } from '@nestjs/common';
import { VooController } from './voo.controller'
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory'

@Injectable()
export class VooControllerFactory {
    constructor(
        private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
    ){}

    create(): VooController {
        const criarVooUseCase = this.criarVooUseCaseFactory.create();
        return new VooController(
            criarVooUseCase,
        )
    }
}