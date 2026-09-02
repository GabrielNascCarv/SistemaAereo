export interface OfertaVoo {
  ofertaId: string;
  companhia: string;
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;
  preco: number;
  moeda: string;
}

export interface Voo {
  id: number;
  numeroVoo: string;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;
  assentosDisponiveis: number;
  preco: number;
  status: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO';
  createdAt: string;
}

export interface Passageiro {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string | null;
  createdAt: string;
}

export interface Reserva {
  id: number;
  codigoReserva: string;
  dataReserva: string;
  status: 'PENDENTE_PAGAMENTO' | 'CONFIRMADA' | 'CANCELADA';
  numeroPassageiros: number;
  vooId: number;
  passageiroId: number;
  createdAt: string;
}

export interface PaginaResultado<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErro {
  message: string | string[];
  error: string;
  statusCode: number;
}
