import { VooResponseDto } from '../../voos/dto/voo-response.dto';

export class TrechoReservaResponseDto {
  vooId: number;
  direcao: string;
  ordem: number;
  voo: VooResponseDto;

  constructor(data: {
    vooId: number;
    direcao: string;
    ordem: number;
    voo: VooResponseDto;
  }) {
    this.vooId = data.vooId;
    this.direcao = data.direcao;
    this.ordem = data.ordem;
    this.voo = data.voo;
  }
}
