import { Injectable } from '@nestjs/common';
import { ReservaController } from './reserva.controller';
import { CriarReservaUseCaseFactory } from '../use-cases/factory/criar-reserva.use-case.factory';

@Injectable()
export class ReservaControllerFactory {
  constructor(private readonly criarReservaUseCaseFactory: CriarReservaUseCaseFactory) {}

  create(): ReservaController {
    const criarReservaUseCase = this.criarReservaUseCaseFactory.create();
    return new ReservaController(criarReservaUseCase);
  }
}
