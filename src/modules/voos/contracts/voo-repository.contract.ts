import { VooEntity } from '../entities/voo.entity';

export interface VooRepositoryContract {
  create(data: {
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status: string;
  }): Promise<VooEntity>;

  findByNumeroVoo(numeroVoo: string): Promise<VooEntity | null>;

  findById(id: number): Promise<VooEntity | null>;

  findAll(): Promise<VooEntity[]>;

  update(id: number, data: Partial<{
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status: string;
  }>): Promise<VooEntity>;

  delete(id: number): Promise<boolean>;
}
