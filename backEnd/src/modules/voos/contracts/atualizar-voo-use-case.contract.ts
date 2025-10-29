import { VooEntity } from '../entities/voo.entity';

export type TAtualizarVooUseCaseParams = {
  numeroVoo?: string;
  origem?: string;
  destino?: string;
  dataPartida?: Date;
  dataChegada?: Date;
  assentosDisponiveis?: number;
  preco?: number;
  status?: string;
};

export interface IAtualizarVooUseCaseContract {
  execute(id: number, params: TAtualizarVooUseCaseParams): Promise<VooEntity>;
}
