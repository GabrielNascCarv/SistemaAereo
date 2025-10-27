import { VooEntity } from "../entities/voo.entity";

export interface ListarVooUseCaseContract {
    execute(): Promise<VooEntity[]>;
}