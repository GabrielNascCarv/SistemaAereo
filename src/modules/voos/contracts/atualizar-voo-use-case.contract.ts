import { VooEntity } from '../entities/voo.entity';

export interface AtualizarVooUseCaseContract {
  execute(
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
}
