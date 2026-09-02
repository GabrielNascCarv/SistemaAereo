import { api } from './client';
import type { OfertaVoo, Voo } from '../types/api';

export function buscarOfertas(params: { origem: string; destino: string; data: string }) {
  const query = new URLSearchParams(params).toString();
  return api.get<OfertaVoo[]>(`/voos-externos/busca?${query}`);
}

export function importarOferta(ofertaId: string) {
  return api.post<Voo>('/voos-externos/importar', { ofertaId });
}
