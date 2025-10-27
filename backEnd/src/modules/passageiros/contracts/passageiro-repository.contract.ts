import { PassageiroEntity } from '../entities/passageiro.entity';

export interface PassageiroRepositoryContract {
  create(data: {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
  }): Promise<PassageiroEntity>;

  findByEmail(email: string): Promise<PassageiroEntity | null>;
  findByCpf(cpf: string): Promise<PassageiroEntity | null>;
  findById(id: number): Promise<PassageiroEntity | null>;
  findAll(): Promise<PassageiroEntity[]>;
  update(id: number, data: {
    nome?: string;
    email?: string;
    cpf?: string;
    telefone?: string;
  }): Promise<PassageiroEntity>;
  delete(id: number): Promise<boolean>;
}
