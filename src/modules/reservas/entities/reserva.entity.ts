import { TrechoReservaEntity } from './trecho-reserva.entity';

export class ReservaEntity {
  constructor(
    public readonly id: number,
    public readonly codigoReserva: string,
    public readonly dataReserva: Date,
    public readonly status: string,
    public readonly numeroPassageiros: number,
    public readonly passageiroId: number,
    public readonly trechos: TrechoReservaEntity[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: number;
    codigoReserva: string;
    dataReserva: Date;
    status: string;
    numeroPassageiros: number;
    passageiroId: number;
    trechos: TrechoReservaEntity[];
    createdAt: Date;
    updatedAt: Date;
  }): ReservaEntity {
    return new ReservaEntity(
      data.id,
      data.codigoReserva,
      data.dataReserva,
      data.status,
      data.numeroPassageiros,
      data.passageiroId,
      data.trechos,
      data.createdAt,
      data.updatedAt,
    );
  }
}
