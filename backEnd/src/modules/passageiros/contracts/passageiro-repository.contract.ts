import { PassageiroEntity } from '../entities/passageiro.entity';

export type TCreatePassageiroRepository = {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
}

export type TUpdatePassageiroRepository = {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}

export interface IPassageiroRepository {
  create(data:TCreatePassageiroRepository): Promise<PassageiroEntity>;
  findByEmail(email: string): Promise<PassageiroEntity | null>;
  findByCpf(cpf: string): Promise<PassageiroEntity | null>;
  findById(id: number): Promise<PassageiroEntity | null>;
  findAll(): Promise<PassageiroEntity[]>;
  update(id: number, data: Partial<TUpdatePassageiroRepository>): Promise<PassageiroEntity>;
  delete(id: number): Promise<boolean>;
}
