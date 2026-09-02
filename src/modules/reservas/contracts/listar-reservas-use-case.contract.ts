import { ReservaEntity } from '../entities/reserva.entity';

export interface ListarReservasUseCaseContract {
  execute(params: { page: number; limit: number }): Promise<{
    data: ReservaEntity[];
    total: number;
  }>;
}
