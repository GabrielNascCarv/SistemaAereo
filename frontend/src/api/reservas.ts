import { api } from './client';
import type { Reserva } from '../types/api';

export function criarReserva(data: { vooId: number; passageiroId: number; numeroPassageiros: number }) {
  return api.post<Reserva>('/reservas', data);
}
