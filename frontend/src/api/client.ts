import type { ApiErro } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function requisicao<T>(path: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as ApiErro | null;
    const mensagem = Array.isArray(corpo?.message)
      ? corpo.message.join(', ')
      : (corpo?.message ?? `Erro ${resposta.status}`);
    throw new ApiError(mensagem, resposta.status);
  }

  return resposta.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => requisicao<T>(path),
  post: <T>(path: string, body: unknown) =>
    requisicao<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    requisicao<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => requisicao<T>(path, { method: 'DELETE' }),
};
