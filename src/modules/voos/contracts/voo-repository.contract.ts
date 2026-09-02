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
    status?: string;
  }): Promise<VooEntity>;

  findByNumeroVoo(numeroVoo: string): Promise<VooEntity | null>;
  findById(id: number): Promise<VooEntity | null>;
  findAll(params: { skip: number; take: number }): Promise<{
    data: VooEntity[];
    total: number;
  }>;
  update(
    id: number,
    data: {
      numeroVoo?: string;
      origem?: string;
      destino?: string;
      dataPartida?: Date;
      dataChegada?: Date;
      assentosDisponiveis?: number;
      preco?: number;
      status?: string;
    },
  ): Promise<VooEntity>;
  delete(id: number): Promise<boolean>;
  possuiReservaAtiva(vooId: number): Promise<boolean>;
}
