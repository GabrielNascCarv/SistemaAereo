export class PassageiroEntity {
  constructor(
    public readonly id: number,
    public readonly nome: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly telefone: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PassageiroEntity {
    return new PassageiroEntity(
      data.id,
      data.nome,
      data.email,
      data.cpf,
      data.telefone,
      data.createdAt,
      data.updatedAt,
    );
  }
}
