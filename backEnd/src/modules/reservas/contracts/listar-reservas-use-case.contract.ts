import { ReservaEntity } from "../entities/reserva.entity";

export interface IListarReservasUseCase {
    execute(): Promise<ReservaEntity[]>;
}