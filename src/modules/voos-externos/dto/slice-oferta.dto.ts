import { SegmentoOfertaDto } from './segmento-oferta.dto';

export class SliceOfertaDto {
  direcao: 'IDA' | 'VOLTA';
  segmentos: SegmentoOfertaDto[];

  constructor(data: {
    direcao: 'IDA' | 'VOLTA';
    segmentos: SegmentoOfertaDto[];
  }) {
    this.direcao = data.direcao;
    this.segmentos = data.segmentos;
  }
}
