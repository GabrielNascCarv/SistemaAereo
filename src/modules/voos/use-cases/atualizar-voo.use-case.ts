import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import type { AtualizarVooUseCaseContract } from '../contracts/atualizar-voo-use-case.contract';
import { VooRepository } from '../repositories/voo.repository';

@Injectable()
export class AtualizarVooUseCase implements AtualizarVooUseCaseContract {
  constructor(private readonly vooRepository: VooRepository) {}

  async execute(
    id: number,
    data: {
      numeroVoo?: string;
      origem?: string;
      destino?: string;
      dataPartida?: Date;
      dataChegada?: Date;
      assentosDisponiveis?: number;
      preco?: number;
      status?: string;
    },
  ) {
    const vooExistente = await this.vooRepository.findById(id);
    if (!vooExistente) {
      throw new NotFoundException('Voo não encontrado');
    }

    if (data.numeroVoo && data.numeroVoo !== vooExistente.numeroVoo) {
      const vooComNumero = await this.vooRepository.findByNumeroVoo(
        data.numeroVoo,
      );
      if (vooComNumero) {
        throw new ConflictException('Número do voo já cadastrado');
      }
    }

    const alterandoDatas =
      data.dataPartida !== undefined || data.dataChegada !== undefined;
    if (alterandoDatas) {
      const possuiReservaConfirmada =
        await this.vooRepository.possuiReservaConfirmada(id);
      if (possuiReservaConfirmada) {
        throw new BadRequestException(
          'Não é possível alterar as datas de um voo com reservas confirmadas',
        );
      }
    }

    const voo = await this.vooRepository.update(id, data);
    return voo;
  }
}
