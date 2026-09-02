import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { criarAppTeste } from './utils/criar-app-teste.util';
import { limparBanco, prismaTeste } from './utils/prisma-test.util';

describe('Voos (e2e)', () => {
  let app: INestApplication<App>;

  const vooValido = {
    numeroVoo: 'AB123',
    origem: 'GRU',
    destino: 'GIG',
    dataPartida: '2026-10-01T10:00:00.000Z',
    dataChegada: '2026-10-01T11:00:00.000Z',
    assentosDisponiveis: 100,
    preco: 499.9,
  };

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

  it('deve criar um voo com status AGENDADO por padrão', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/api/voos')
      .send(vooValido)
      .expect(201);

    expect(resposta.body).toMatchObject({
      numeroVoo: vooValido.numeroVoo,
      status: 'AGENDADO',
      assentosDisponiveis: 100,
    });
  });

  it('deve rejeitar número de voo duplicado com 409', async () => {
    await request(app.getHttpServer()).post('/api/voos').send(vooValido).expect(201);

    await request(app.getHttpServer())
      .post('/api/voos')
      .send({ ...vooValido, origem: 'CGH' })
      .expect(409);
  });

  it('deve listar voos de forma paginada', async () => {
    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/api/voos')
        .send({ ...vooValido, numeroVoo: `VOO${i}` })
        .expect(201);
    }

    const resposta = await request(app.getHttpServer()).get('/api/voos?page=1&limit=2').expect(200);

    expect(resposta.body.data).toHaveLength(2);
    expect(resposta.body.total).toBe(3);
    expect(resposta.body.totalPages).toBe(2);
  });

  it('deve atualizar e deletar um voo (fluxo completo)', async () => {
    const criado = await request(app.getHttpServer()).post('/api/voos').send(vooValido).expect(201);
    const id = criado.body.id;

    await request(app.getHttpServer())
      .put(`/api/voos/${id}`)
      .send({ preco: 599.9 })
      .expect(200)
      .expect(res => expect(res.body.preco).toBe(599.9));

    await request(app.getHttpServer())
      .delete(`/api/voos/${id}`)
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    await request(app.getHttpServer()).get(`/api/voos/${id}`).expect(404);
  });

  it('deve concluir automaticamente um voo cuja data de chegada já passou', async () => {
    const criado = await request(app.getHttpServer())
      .post('/api/voos')
      .send({
        ...vooValido,
        numeroVoo: 'PAST01',
        dataPartida: '2020-01-01T10:00:00.000Z',
        dataChegada: '2020-01-01T12:00:00.000Z',
      })
      .expect(201);

    const resposta = await request(app.getHttpServer())
      .get(`/api/voos/${criado.body.id}`)
      .expect(200);

    expect(resposta.body.status).toBe('CONCLUIDO');
  });

  it('deve retornar 404 ao buscar um voo inexistente', async () => {
    await request(app.getHttpServer()).get('/api/voos/999999').expect(404);
  });
});
