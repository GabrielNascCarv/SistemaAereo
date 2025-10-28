import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ReservaRepository } from '../repositories/reserva.repository';
import { AtualizarReservaParams } from '../contracts/reserva-repository.contract';

@Injectable()
export class AtualizarReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
  ) {}

  async execute(id: number, data: AtualizarReservaParams) {
    const reservaExistente = await this.reservaRepository.findById(id);
    if (!reservaExistente) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (data.codigoReserva && data.codigoReserva !== reservaExistente.codigoReserva) {
      const reservaComCodigo = await this.reservaRepository.findByCodigoReserva(data.codigoReserva);
      if (reservaComCodigo) {
        throw new ConflictException('Código da reserva já cadastrado');
      }
    }

    return await this.reservaRepository.update(id, data);
  }
}