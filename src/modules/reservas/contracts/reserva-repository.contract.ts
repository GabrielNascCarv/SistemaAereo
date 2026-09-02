import { ReservaEntity } from '../entities/reserva.entity';

export interface ReservaRepositoryContract {
  create(data: {
    codigoReserva: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
    status?: string;
  }): Promise<ReservaEntity>;

  findByCodigoReserva(codigoReserva: string): Promise<ReservaEntity | null>;
  findById(id: number): Promise<ReservaEntity | null>;
  findAll(): Promise<ReservaEntity[]>;
  update(id: number, data: {
    status?: string;
    numeroPassageiros?: number;
  }): Promise<ReservaEntity>;
  delete(id: number): Promise<boolean>;
}
