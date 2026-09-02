import { ReservaEntity } from '../entities/reserva.entity';

export interface CriarReservaUseCaseContract {
  execute(data: {
    numeroPassageiros: number;
    passageiroId: number;
    trechos: Array<{ vooId: number; direcao: 'IDA' | 'VOLTA'; ordem: number }>;
  }): Promise<ReservaEntity>;
}
