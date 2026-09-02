import { VooEntity } from '../entities/voo.entity';

export interface ListarVoosUseCaseContract {
  execute(): Promise<VooEntity[]>;
}
