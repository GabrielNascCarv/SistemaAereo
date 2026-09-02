import { ReservaEntity } from '../entities/reserva.entity';

export interface AtualizarReservaUseCaseContract {
  execute(id: number, data: {
    status?: string;
    numeroPassageiros?: number;
  }): Promise<ReservaEntity>;
}
