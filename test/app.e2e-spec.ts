import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { criarAppTeste } from './utils/criar-app-teste.util';
import { limparBanco, prismaTeste } from './utils/prisma-test.util';

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await criarAppTeste();
  });

  afterAll(async () => {
    await app.close();
    await prismaTeste.$disconnect();
  });

  beforeEach(async () => {
    await limparBanco();
  });

  it('deve responder 404 para uma rota inexistente', () => {
    return request(app.getHttpServer()).get('/rota-que-nao-existe').expect(404);
  });

  it('deve expor as rotas de passageiros, voos e reservas sob /api', async () => {
    await request(app.getHttpServer()).get('/api/passageiros').expect(200);
    await request(app.getHttpServer()).get('/api/voos').expect(200);
    await request(app.getHttpServer()).get('/api/reservas').expect(200);
  });
});
