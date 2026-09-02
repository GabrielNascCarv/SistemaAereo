import { api } from './client';
import type { Passageiro } from '../types/api';

export function criarPassageiro(data: {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
}) {
  return api.post<Passageiro>('/passageiros', data);
}
