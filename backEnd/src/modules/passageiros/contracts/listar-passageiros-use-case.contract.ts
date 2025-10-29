import { PassageiroEntity } from "../entities/passageiro.entity";

export interface IListarPassageirosUseCase {
    execute(): Promise<PassageiroEntity[]>;
}