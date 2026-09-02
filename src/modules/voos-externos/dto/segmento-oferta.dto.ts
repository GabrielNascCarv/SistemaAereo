export class SegmentoOfertaDto {
  numeroVoo: string;
  companhia: string;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;

  constructor(data: {
    numeroVoo: string;
    companhia: string;
    origem: string;
    destino: string;
    dataPartida: string;
    dataChegada: string;
  }) {
    this.numeroVoo = data.numeroVoo;
    this.companhia = data.companhia;
    this.origem = data.origem;
    this.destino = data.destino;
    this.dataPartida = data.dataPartida;
    this.dataChegada = data.dataChegada;
  }
}
