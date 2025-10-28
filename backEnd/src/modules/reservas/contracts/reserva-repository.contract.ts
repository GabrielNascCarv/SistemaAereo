import { ReservaEntity } from "../entities/reserva.entity";

export interface CriarReservaParams {
    codigoReserva?: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
}

export interface AtualizarReservaParams {
    codigoReserva?: string;
    status?: string;
    numeroPassageiros?: number;
    vooId?: number;
    passageiroId?: number;
}

export interface ReservaRepositoryContract {
    create(data: CriarReservaParams): Promise<ReservaEntity>;
    findAll(): Promise<ReservaEntity[]>;
    findById(id: number): Promise<ReservaEntity | null>;
    update(id: number, data: AtualizarReservaParams): Promise<ReservaEntity>;
    findByCodigoReserva(codigoReserva: string): Promise<ReservaEntity | null>;
}