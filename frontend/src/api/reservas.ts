import { api } from './client';
import type { PaginaResultado, Reserva } from '../types/api';

export function criarReserva(data: {
  passageiroId: number;
  numeroPassageiros: number;
  trechos: Array<{ vooId: number; direcao: 'IDA' | 'VOLTA'; ordem: number }>;
}) {
  return api.post<Reserva>('/reservas', data);
}

export function listarReservas(params: { page: number; limit: number }) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  }).toString();
  return api.get<PaginaResultado<Reserva>>(`/reservas?${query}`);
}

export function cancelarReserva(id: number) {
  return api.put<Reserva>(`/reservas/${id}`, { status: 'CANCELADA' });
}

export function deletarReserva(id: number) {
  return api.delete<{ success: boolean; message: string }>(`/reservas/${id}`);
}
