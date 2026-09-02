import { Injectable } from '@nestjs/common';
import { ReservaController } from './reserva.controller';
import { CriarReservaUseCaseFactory } from '../use-cases/factory/criar-reserva.use-case.factory';
import { ListarReservasUseCaseFactory } from '../use-cases/factory/listar-reservas.use-case.factory';
import { ListarReservaPorIdUseCaseFactory } from '../use-cases/factory/listar-reserva-por-id.use-case.factory';

@Injectable()
export class ReservaControllerFactory {
  constructor(
    private readonly criarReservaUseCaseFactory: CriarReservaUseCaseFactory,
    private readonly listarReservasUseCaseFactory: ListarReservasUseCaseFactory,
    private readonly listarReservaPorIdUseCaseFactory: ListarReservaPorIdUseCaseFactory,
  ) {}

  create(): ReservaController {
    const criarReservaUseCase = this.criarReservaUseCaseFactory.create();
    const listarReservasUseCase = this.listarReservasUseCaseFactory.create();
    const listarReservaPorIdUseCase = this.listarReservaPorIdUseCaseFactory.create();
    return new ReservaController(criarReservaUseCase, listarReservasUseCase, listarReservaPorIdUseCase);
  }
}
