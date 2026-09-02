import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import type { CriarReservaUseCaseContract } from '../contracts/criar-reserva-use-case.contract';
import { ReservaRepository } from '../repositories/reserva.repository';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { PassageiroRepository } from '../../passageiros/repositories/passageiro.repository';

@Injectable()
export class CriarReservaUseCase implements CriarReservaUseCaseContract {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly vooRepository: VooRepository,
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  async execute(data: {
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
  }) {
    const voo = await this.vooRepository.findById(data.vooId);
    if (!voo) {
      throw new NotFoundException('Voo não encontrado');
    }

    if (voo.status === 'CANCELADO' || voo.status === 'CONCLUIDO') {
      throw new BadRequestException(
        'Não é possível reservar em um voo cancelado ou concluído',
      );
    }

    const passageiro = await this.passageiroRepository.findById(
      data.passageiroId,
    );
    if (!passageiro) {
      throw new NotFoundException('Passageiro não encontrado');
    }

    if (voo.assentosDisponiveis < data.numeroPassageiros) {
      throw new BadRequestException(
        'Assentos disponíveis insuficientes para este voo',
      );
    }

    const codigoReserva = this.gerarCodigoReserva();
    const codigoJaExiste =
      await this.reservaRepository.findByCodigoReserva(codigoReserva);
    if (codigoJaExiste) {
      throw new ConflictException('Código de reserva já cadastrado');
    }

    const reserva = await this.reservaRepository.create({
      codigoReserva,
      numeroPassageiros: data.numeroPassageiros,
      vooId: data.vooId,
      passageiroId: data.passageiroId,
    });

    await this.vooRepository.update(voo.id, {
      assentosDisponiveis: voo.assentosDisponiveis - data.numeroPassageiros,
    });

    return reserva;
  }

  private gerarCodigoReserva(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const aleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RES-${timestamp}-${aleatorio}`;
  }
}
