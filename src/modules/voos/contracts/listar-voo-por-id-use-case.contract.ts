import { VooEntity } from '../entities/voo.entity';

export interface ListarVooPorIdUseCaseContract {
  execute(id: number): Promise<VooEntity | null>;
}
