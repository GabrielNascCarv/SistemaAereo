import { Injectable } from '@nestjs/common';
import { CriarVooUseCase } from '../criar-voo.use-case'
import { VooRepository } from '../../repositories/voo.repository';

@Injectable()
export class CriarVooUseCaseFactory {
    constructor(private readonly vooRepository: VooRepository){}

    create(): CriarVooUseCase {
        return new CriarVooUseCase(this.vooRepository);
    }
}

