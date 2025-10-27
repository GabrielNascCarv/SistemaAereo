import { ReservaEntity } from "../entities/reserva.entity";

export interface ListarReservaPorIdUseCaseContract {
    execute(id: number): Promise<ReservaEntity | null>;
}