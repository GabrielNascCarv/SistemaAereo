import { VooEntity } from '../entities/voo.entity';

export type TCriarVooParams = {
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: Date;
  dataChegada: Date;
  assentosDisponiveis: number;
  preco: number;
  status: string;
};

export type TAtualizarVooParams = Partial<{
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: Date;
  dataChegada: Date;
  assentosDisponiveis: number;
  preco: number;
  status: string;
}>;

export interface IVooRepositoryContract {
  create(data: TCriarVooParams): Promise<VooEntity>;
  findByNumeroVoo(numeroVoo: string): Promise<VooEntity | null>;
  findById(id: number): Promise<VooEntity | null>;
  findAll(): Promise<VooEntity[]>;
  update(id: number, data: TAtualizarVooParams): Promise<VooEntity>;
  delete(id: number): Promise<boolean>;
}
