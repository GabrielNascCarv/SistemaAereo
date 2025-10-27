export class VooEntity {
  constructor(
    public readonly id: number,
    public readonly numeroVoo: string,
    public readonly origem: string,
    public readonly destino: string,
    public readonly dataPartida: Date,
    public readonly dataChegada: Date,
    public readonly assentosDisponiveis: number,
    public readonly preco: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
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
    updatedAt: Date;
  }): VooEntity {
    return new VooEntity(
      data.id,
      data.numeroVoo,
      data.origem,
      data.destino,
      data.dataPartida,
      data.dataChegada,
      data.assentosDisponiveis,
      data.preco,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }
}
