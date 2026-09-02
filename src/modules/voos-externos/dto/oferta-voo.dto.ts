export class OfertaVooDto {
  ofertaId: string;
  companhia: string;
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;
  preco: number;
  moeda: string;

  constructor(data: {
    ofertaId: string;
    companhia: string;
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: string;
    dataChegada: string;
    preco: number;
    moeda: string;
  }) {
    this.ofertaId = data.ofertaId;
    this.companhia = data.companhia;
    this.numeroVoo = data.numeroVoo;
    this.origem = data.origem;
    this.destino = data.destino;
    this.dataPartida = data.dataPartida;
    this.dataChegada = data.dataChegada;
    this.preco = data.preco;
    this.moeda = data.moeda;
  }
}
