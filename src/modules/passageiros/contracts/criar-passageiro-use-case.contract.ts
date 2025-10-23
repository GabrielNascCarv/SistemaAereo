import { PassageiroEntity } from '../entities/passageiro.entity';

export interface CriarPassageiroUseCaseContract {
  execute(data: {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
  }): Promise<PassageiroEntity>;
}
