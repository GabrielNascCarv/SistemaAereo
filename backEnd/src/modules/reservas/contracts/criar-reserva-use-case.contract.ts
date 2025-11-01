import { ReservaEntity } from "../entities/reserva.entity";

export type TCriarReservaParams = {
    codigoReserva: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
}

export interface ICriarReservaUseCase {
    execute(data: TCriarReservaParams): Promise<ReservaEntity>;
}