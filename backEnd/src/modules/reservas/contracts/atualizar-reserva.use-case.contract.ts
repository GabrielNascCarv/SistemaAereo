import { ReservaEntity } from '../entities/reserva.entity';
import { AtualizarReservaParams } from './reserva-repository.contract';

export interface AtualizarReservaUseCaseContract {
    execute(id: number, data: AtualizarReservaParams): Promise<ReservaEntity>;
}