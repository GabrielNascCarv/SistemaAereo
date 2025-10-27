import { ReservaEntity } from "../entities/reserva.entity";
import { CriarReservaDto } from "../dto/criar-reserva.dto";

export interface CriarReservaUseCaseContract {
    execute(data: CriarReservaDto): Promise<ReservaEntity>;
}