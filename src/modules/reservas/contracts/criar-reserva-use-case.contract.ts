import { ReservaEntity } from '../entities/reserva.entity';

export interface CriarReservaUseCaseContract {
  execute(data: {
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
  }): Promise<ReservaEntity>;
}
