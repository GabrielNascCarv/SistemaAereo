import { PassageiroEntity } from "../entities/passageiro.entity";

export interface ListarPassageirosUseCaseContract {
    execute(params: { page: number; limit: number }): Promise<{
        data: PassageiroEntity[];
        total: number;
    }>;
}
