import { api } from './client';
import type { OfertaVoo, SugestaoLugar, TrechoReserva } from '../types/api';

export function buscarOfertas(params: {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta?: string;
}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, valor]) => !!valor)),
  ).toString();
  return api.get<OfertaVoo[]>(`/voos-externos/busca?${query}`);
}

export function buscarLugares(query: string) {
  return api.get<SugestaoLugar[]>(`/voos-externos/lugares?query=${encodeURIComponent(query)}`);
}

export function importarOferta(ofertaId: string) {
  return api.post<TrechoReserva[]>('/voos-externos/importar', { ofertaId });
}
