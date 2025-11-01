import { ReservaEntity } from "../entities/reserva.entity";

export type TCriarReservaParams = {
    codigoReserva: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
}

export type TAtualizarReservaParams = {
    codigoReserva?: string;
    status?: string;
    numeroPassageiros?: number;
    vooId?: number;
    passageiroId?: number;
}

export interface IReservaRepository {
    create(data: TCriarReservaParams): Promise<ReservaEntity>;
    findAll(): Promise<ReservaEntity[]>;
    findById(id: number): Promise<ReservaEntity | null>;
    update(id: number, data: TAtualizarReservaParams): Promise<ReservaEntity>;
    findByCodigoReserva(crodigoReserva: string): Promise<ReservaEntity | null>;
    delete(id: number): Promise<boolean>;
}