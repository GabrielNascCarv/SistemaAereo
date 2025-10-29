import { ReservaEntity } from '../entities/reserva.entity';

export type TAtualizarReservaParams = {
    codigoReserva?: string;
    status?: string;
    numeroPassageiros?: number;
    vooId?: number;
    passageiroId?: number;
}

export interface IAtualizarReservaUseCase {
    execute(id: number, data: TAtualizarReservaParams): Promise<ReservaEntity>;
}