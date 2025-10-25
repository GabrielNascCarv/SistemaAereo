export class VooResponseDto {
  id: number;
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: Date;
  dataChegada: Date;
  assentosDisponiveis: number;
  preco: number;
  status: string;
  createdAt: Date;

  constructor(data: {
    id: number;
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status: string;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.numeroVoo = data.numeroVoo;
    this.origem = data.origem;
    this.destino = data.destino;
    this.dataPartida = data.dataPartida;
    this.dataChegada = data.dataChegada;
    this.assentosDisponiveis = data.assentosDisponiveis;
    this.preco = data.preco;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}
