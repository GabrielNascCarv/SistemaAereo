import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ReservaRepository } from '../repositories/reserva.repository';
import { IAtualizarReservaUseCase, TAtualizarReservaParams } from '../contracts/atualizar-reserva.use-case.contract';
import { ReservaEntity } from '../entities/reserva.entity';

@Injectable()
export class AtualizarReservaUseCase implements IAtualizarReservaUseCase{
  constructor(
    private readonly reservaRepository: ReservaRepository,
  ) {}

  async execute(id: number, data: TAtualizarReservaParams): Promise <ReservaEntity> {

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

    const reserva =  await this.reservaRepository.update(id, data);
    return reserva;
  }
}