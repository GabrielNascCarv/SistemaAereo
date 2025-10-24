// src/modules/reservas/contracts/reserva-repository.contract.ts
import { ReservaEntity } from "../entities/reserva.entity";

export interface ReservaRepositoryContract {
    create(data: {
        codigoReserva: string;
        numeroPassageiros: number;
        vooId: number;
        passageiroId: number;
    }): Promise<ReservaEntity>;
}