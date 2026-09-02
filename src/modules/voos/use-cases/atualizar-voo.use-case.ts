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

    const numeroVooFinal = data.numeroVoo ?? vooExistente.numeroVoo;
    const dataPartidaFinal = data.dataPartida ?? vooExistente.dataPartida;
    const identificadorMudou =
      numeroVooFinal !== vooExistente.numeroVoo ||
      dataPartidaFinal.getTime() !== vooExistente.dataPartida.getTime();

    if (identificadorMudou) {
      const vooComNumero = await this.vooRepository.findByNumeroVoo(
        numeroVooFinal,
        dataPartidaFinal,
      );
      if (vooComNumero) {
        throw new ConflictException(
          'Já existe um voo com esse número nessa data de partida',
        );
      }
    }

    const alterandoDatas =
      data.dataPartida !== undefined || data.dataChegada !== undefined;
    if (alterandoDatas) {
      const possuiReservaAtiva =
        await this.vooRepository.possuiReservaAtiva(id);
      if (possuiReservaAtiva) {
        throw new BadRequestException(
          'Não é possível alterar as datas de um voo com reservas ativas',
        );
      }
    }

    const voo = await this.vooRepository.update(id, data);
    return voo;
  }
}
