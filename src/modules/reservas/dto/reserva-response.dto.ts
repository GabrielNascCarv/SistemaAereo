import { TrechoReservaResponseDto } from './trecho-reserva-response.dto';

export class ReservaResponseDto {
  id: number;
  codigoReserva: string;
  dataReserva: Date;
  status: string;
  numeroPassageiros: number;
  passageiroId: number;
  trechos: TrechoReservaResponseDto[];
  createdAt: Date;

  constructor(data: {
    id: number;
    codigoReserva: string;
    dataReserva: Date;
    status: string;
    numeroPassageiros: number;
    passageiroId: number;
    trechos: TrechoReservaResponseDto[];
    createdAt: Date;
  }) {
    this.id = data.id;
    this.codigoReserva = data.codigoReserva;
    this.dataReserva = data.dataReserva;
    this.status = data.status;
    this.numeroPassageiros = data.numeroPassageiros;
    this.passageiroId = data.passageiroId;
    this.trechos = data.trechos;
    this.createdAt = data.createdAt;
  }
}
