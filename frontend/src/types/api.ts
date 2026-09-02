export interface SegmentoOferta {
  numeroVoo: string;
  companhia: string;
  origem: string;
  destino: string;
  dataPartida: string;
  dataChegada: string;
}

export interface SliceOferta {
  direcao: 'IDA' | 'VOLTA';
  segmentos: SegmentoOferta[];
}

export interface OfertaVoo {
  ofertaId: string;
  preco: number;
  moeda: string;
  origem: string;
  destino: string;
  idaEVolta: boolean;
  slices: SliceOferta[];
}

export interface SugestaoLugar {
  iataCode: string;
  nome: string;
  cidade: string | null;
  tipo: 'airport' | 'city';
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

export interface TrechoReserva {
  vooId: number;
  direcao: 'IDA' | 'VOLTA';
  ordem: number;
  voo: Voo;
}

export interface Reserva {
  id: number;
  codigoReserva: string;
  dataReserva: string;
  status: 'PENDENTE_PAGAMENTO' | 'CONFIRMADA' | 'CANCELADA';
  numeroPassageiros: number;
  passageiroId: number;
  trechos: TrechoReserva[];
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
