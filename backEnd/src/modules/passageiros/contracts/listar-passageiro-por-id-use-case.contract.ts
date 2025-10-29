import { PassageiroEntity } from '../entities/passageiro.entity';

export interface IListarPassageiroPorIdUseCase {
  execute(id: number): Promise<PassageiroEntity | null>;
}

