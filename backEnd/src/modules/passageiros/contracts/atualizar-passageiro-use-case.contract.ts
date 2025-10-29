import { PassageiroEntity } from '../entities/passageiro.entity';

export type TAtualizarPassageiroUseCase = {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
}

export interface IAtualizarPassageiroUseCase {
  execute(id: number, data: TAtualizarPassageiroUseCase ): Promise<PassageiroEntity>;
}
