import { VooEntity } from '../entities/voo.entity';

export interface CriarVooUseCaseContract {
  execute(data: {
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status?: string;
  }): Promise<VooEntity>;
}
