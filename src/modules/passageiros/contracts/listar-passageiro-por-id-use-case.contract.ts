import { PassageiroEntity } from '../entities/passageiro.entity';

export interface ListarPassageiroPorIdUseCaseContract {
  execute(id: number): Promise<PassageiroEntity | null>;
}

