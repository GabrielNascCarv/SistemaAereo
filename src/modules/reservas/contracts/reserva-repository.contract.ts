import { ReservaEntity } from "../entities/reserva.entity";
import { CriarReservaDto } from "../dto/criar-reserva.dto";

export interface ReservaRepositoryContract {
    create(data: CriarReservaDto): Promise<ReservaEntity>;
}