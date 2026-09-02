import { ReservaEntity } from '../entities/reserva.entity';

export interface ReservaRepositoryContract {
  create(data: {
    codigoReserva: string;
    numeroPassageiros: number;
    passageiroId: number;
    status?: string;
    trechos: Array<{ vooId: number; direcao: 'IDA' | 'VOLTA'; ordem: number }>;
  }): Promise<ReservaEntity>;

  findByCodigoReserva(codigoReserva: string): Promise<ReservaEntity | null>;
  findById(id: number): Promise<ReservaEntity | null>;
  findAll(params: { skip: number; take: number }): Promise<{
    data: ReservaEntity[];
    total: number;
  }>;
  update(
    id: number,
    data: {
      status?: string;
      numeroPassageiros?: number;
    },
  ): Promise<ReservaEntity>;
  delete(id: number): Promise<boolean>;
}
