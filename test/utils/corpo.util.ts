import { Response } from 'supertest';

export function corpoComo<T>(resposta: Response): T {
  return resposta.body as T;
}
