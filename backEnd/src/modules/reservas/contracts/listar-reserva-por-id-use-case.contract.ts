import { ReservaEntity } from '../entities/reserva.entity';

export interface IListarReservaPorIdUseCase {
  execute(id: number): Promise<ReservaEntity | null>;
}