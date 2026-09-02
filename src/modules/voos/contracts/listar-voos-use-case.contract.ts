import { VooEntity } from '../entities/voo.entity';

export interface ListarVoosUseCaseContract {
  execute(params: { page: number; limit: number }): Promise<{
    data: VooEntity[];
    total: number;
  }>;
}
