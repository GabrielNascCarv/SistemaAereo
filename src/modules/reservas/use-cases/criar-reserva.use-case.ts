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
    passageiroId: number;
    trechos: Array<{ vooId: number; direcao: 'IDA' | 'VOLTA'; ordem: number }>;
  }) {
    if (data.trechos.length === 0) {
      throw new BadRequestException('A reserva precisa de ao menos um trecho');
    }

    // Um mesmo voo pode aparecer só uma vez por reserva (ordem/direção únicas
    // já garantem isso no banco, mas validamos cedo pra dar um erro melhor).
    const vooIdsUnicos = [
      ...new Set(data.trechos.map((trecho) => trecho.vooId)),
    ];

    const voos = await Promise.all(
      vooIdsUnicos.map((vooId) => this.vooRepository.findById(vooId)),
    );

    for (let i = 0; i < voos.length; i++) {
      const voo = voos[i];
      if (!voo) {
        throw new NotFoundException(`Voo ${vooIdsUnicos[i]} não encontrado`);
      }
      if (voo.status === 'CANCELADO' || voo.status === 'CONCLUIDO') {
        throw new BadRequestException(
          `Não é possível reservar o voo ${voo.numeroVoo}: está cancelado ou concluído`,
        );
      }
      if (voo.assentosDisponiveis < data.numeroPassageiros) {
        throw new BadRequestException(
          `Assentos disponíveis insuficientes no voo ${voo.numeroVoo}`,
        );
      }
    }

    const passageiro = await this.passageiroRepository.findById(
      data.passageiroId,
    );
    if (!passageiro) {
      throw new NotFoundException('Passageiro não encontrado');
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
      passageiroId: data.passageiroId,
      trechos: data.trechos,
      // Sem gateway de pagamento integrado: a reserva nasce aguardando
      // pagamento e o assento já é reservado (fica CANCELADA se desistir).
      status: 'PENDENTE_PAGAMENTO',
    });

    await Promise.all(
      voos.map((voo) =>
        this.vooRepository.update(voo!.id, {
          assentosDisponiveis:
            voo!.assentosDisponiveis - data.numeroPassageiros,
        }),
      ),
    );

    return reserva;
  }

  private gerarCodigoReserva(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const aleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RES-${timestamp}-${aleatorio}`;
  }
}
