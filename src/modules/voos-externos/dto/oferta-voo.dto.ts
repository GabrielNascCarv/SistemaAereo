import { SliceOfertaDto } from './slice-oferta.dto';

export class OfertaVooDto {
  ofertaId: string;
  preco: number;
  moeda: string;
  origem: string;
  destino: string;
  idaEVolta: boolean;
  slices: SliceOfertaDto[];

  constructor(data: {
    ofertaId: string;
    preco: number;
    moeda: string;
    origem: string;
    destino: string;
    idaEVolta: boolean;
    slices: SliceOfertaDto[];
  }) {
    this.ofertaId = data.ofertaId;
    this.preco = data.preco;
    this.moeda = data.moeda;
    this.origem = data.origem;
    this.destino = data.destino;
    this.idaEVolta = data.idaEVolta;
    this.slices = data.slices;
  }
}
