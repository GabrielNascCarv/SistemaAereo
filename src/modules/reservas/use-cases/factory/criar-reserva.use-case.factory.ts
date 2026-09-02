import { Injectable } from '@nestjs/common';
import { CriarReservaUseCase } from '../criar-reserva.use-case';
import { ReservaRepository } from '../../repositories/reserva.repository';
import { VooRepository } from '../../../voos/repositories/voo.repository';
import { PassageiroRepository } from '../../../passageiros/repositories/passageiro.repository';

@Injectable()
export class CriarReservaUseCaseFactory {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  create(): CriarReservaUseCase {
    return new CriarReservaUseCase(
      this.reservaRepository,
      this.vooRepository,
      this.passageiroRepository,
    );
  }
}
