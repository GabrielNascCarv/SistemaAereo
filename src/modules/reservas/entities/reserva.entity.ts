export class ReservaEntity {
  constructor(
    public readonly id: number,
    public readonly codigoReserva: string,
    public readonly dataReserva: Date,
    public readonly status: string,
    public readonly numeroPassageiros: number,
    public readonly vooId: number,
    public readonly passageiroId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: number;
    codigoReserva: string;
    dataReserva: Date;
    status: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
    createdAt: Date;
    updatedAt: Date;
  }): ReservaEntity {
    return new ReservaEntity(
      data.id,
      data.codigoReserva,
      data.dataReserva,
      data.status,
      data.numeroPassageiros,
      data.vooId,
      data.passageiroId,
      data.createdAt,
      data.updatedAt,
    );
  }
}
