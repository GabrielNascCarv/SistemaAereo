import { VooEntity } from '../entities/voo.entity';

export interface IListarVooUseCaseContract {
  execute(): Promise<VooEntity[]>;
}
