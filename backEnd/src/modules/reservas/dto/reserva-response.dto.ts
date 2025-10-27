export class ReservaResponseDto {
  id: number;
  codigoReserva: string;
  dataReserva: Date;
  status: string;
  numeroPassageiros: number;
  vooId: number;
  passageiroId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: number;
    codigoReserva: string;
    dataReserva: Date;
    status: string;
    numeroPassageiros: number;
    vooId: number;
    passageiroId: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.codigoReserva = data.codigoReserva;
    this.dataReserva = data.dataReserva;
    this.status = data.status;
    this.numeroPassageiros = data.numeroPassageiros;
    this.vooId = data.vooId;
    this.passageiroId = data.passageiroId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}