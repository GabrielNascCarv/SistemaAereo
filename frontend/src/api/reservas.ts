import { api } from './client';
import type { Reserva } from '../types/api';

export function criarReserva(data: {
  passageiroId: number;
  numeroPassageiros: number;
  trechos: Array<{ vooId: number; direcao: 'IDA' | 'VOLTA'; ordem: number }>;
}) {
  return api.post<Reserva>('/reservas', data);
}
