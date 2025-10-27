export class PassageiroResponseDto {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string | null;
  createdAt: Date;

  constructor(data: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string | null;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.cpf = data.cpf;
    this.telefone = data.telefone;
    this.createdAt = data.createdAt;
  }
}
