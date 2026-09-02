import { Injectable } from '@nestjs/common';
import { ReservaController } from './reserva.controller';
import { CriarReservaUseCaseFactory } from '../use-cases/factory/criar-reserva.use-case.factory';
import { ListarReservasUseCaseFactory } from '../use-cases/factory/listar-reservas.use-case.factory';

@Injectable()
export class ReservaControllerFactory {
  constructor(
    private readonly criarReservaUseCaseFactory: CriarReservaUseCaseFactory,
    private readonly listarReservasUseCaseFactory: ListarReservasUseCaseFactory,
  ) {}

  create(): ReservaController {
    const criarReservaUseCase = this.criarReservaUseCaseFactory.create();
    const listarReservasUseCase = this.listarReservasUseCaseFactory.create();
    return new ReservaController(criarReservaUseCase, listarReservasUseCase);
  }
}
