import { PassageiroEntity } from "../entities/passageiro.entity";

export interface DeletarPassageiroUseCaseContract {
  execute(id: number): Promise<boolean>;
}