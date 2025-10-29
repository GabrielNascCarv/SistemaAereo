import { VooEntity } from '../entities/voo.entity';

export type TCriarVooUseCaseParams = {
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;
  assentosDisponiveis: number;
  preco: number;
  status?: string;
};

export interface ICriarVooUseCaseContract {
  execute(params: TCriarVooUseCaseParams): Promise<VooEntity>;
}
