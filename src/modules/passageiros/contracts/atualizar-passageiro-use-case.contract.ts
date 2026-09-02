import { PassageiroEntity } from '../entities/passageiro.entity';

export interface AtualizarPassageiroUseCaseContract {
  execute(
    id: number,
    data: {
      nome?: string;
      email?: string;
      cpf?: string;
      telefone?: string;
    },
  ): Promise<PassageiroEntity>;
}
