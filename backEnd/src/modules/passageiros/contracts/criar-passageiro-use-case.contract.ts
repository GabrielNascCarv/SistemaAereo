import { PassageiroEntity } from '../entities/passageiro.entity';

export type TCreatePassageiroUseCase = {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}

export interface ICriarPassageiroUseCase {
  execute(data: TCreatePassageiroUseCase): Promise<PassageiroEntity>;
}
