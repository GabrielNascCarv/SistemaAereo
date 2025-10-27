import { ReservaEntity } from "../entities/reserva.entity";

export interface ListarReservasUseCaseContract {
    execute(): Promise<ReservaEntity[]>;
}