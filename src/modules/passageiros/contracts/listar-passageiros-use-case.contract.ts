import { PassageiroEntity } from "../entities/passageiro.entity";

export interface ListarPassageirosUseCaseContract {
    execute(): Promise<PassageiroEntity[]>;
}