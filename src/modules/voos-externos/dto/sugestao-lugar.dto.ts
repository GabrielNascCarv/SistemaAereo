export class SugestaoLugarDto {
  iataCode: string;
  nome: string;
  cidade: string | null;
  tipo: 'airport' | 'city';

  constructor(data: {
    iataCode: string;
    nome: string;
    cidade: string | null;
    tipo: 'airport' | 'city';
  }) {
    this.iataCode = data.iataCode;
    this.nome = data.nome;
    this.cidade = data.cidade;
    this.tipo = data.tipo;
  }
}
