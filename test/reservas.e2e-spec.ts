import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { criarAppTeste } from './utils/criar-app-teste.util';
import { limparBanco, prismaTeste } from './utils/prisma-test.util';

describe('Reservas (e2e)', () => {
  let app: INestApplication<App>;

  const passageiroValido = {
    nome: 'João Silva',
    email: 'joao@teste.com',
    cpf: '123.456.789-01',
    telefone: '(11) 91234-5678',
  };

  const vooValido = {
    numeroVoo: 'AB123',
    origem: 'GRU',
    destino: 'GIG',
    dataPartida: '2026-10-01T10:00:00.000Z',
    dataChegada: '2026-10-01T11:00:00.000Z',
    assentosDisponiveis: 100,
    preco: 499.9,
  };

  async function criarPassageiro() {
    const resposta = await request(app.getHttpServer())
      .post('/api/passageiros')
      .send(passageiroValido)
      .expect(201);
    return resposta.body.id as number;
  }

  async function criarVoo(overrides: Partial<typeof vooValido> = {}) {
    const resposta = await request(app.getHttpServer())
      .post('/api/voos')
      .send({ ...vooValido, ...overrides })
      .expect(201);
    return resposta.body.id as number;
  }

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

  it('deve criar uma reserva e decrementar os assentos disponíveis do voo', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const reserva = await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId, passageiroId, numeroPassageiros: 2 })
      .expect(201);

    expect(reserva.body).toMatchObject({
      status: 'CONFIRMADA',
      numeroPassageiros: 2,
      vooId,
      passageiroId,
    });
    expect(reserva.body.codigoReserva).toMatch(/^RES-/);

    const voo = await request(app.getHttpServer()).get(`/api/voos/${vooId}`).expect(200);
    expect(voo.body.assentosDisponiveis).toBe(98);
  });

  it('deve retornar 404 ao reservar em um voo inexistente', async () => {
    const passageiroId = await criarPassageiro();

    await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId: 999999, passageiroId, numeroPassageiros: 1 })
      .expect(404);
  });

  it('deve retornar 404 ao reservar para um passageiro inexistente', async () => {
    const vooId = await criarVoo();

    await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId, passageiroId: 999999, numeroPassageiros: 1 })
      .expect(404);
  });

  it('deve retornar 400 quando não há assentos suficientes', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo({ assentosDisponiveis: 1 });

    await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId, passageiroId, numeroPassageiros: 2 })
      .expect(400);
  });

  it('deve retornar 400 ao reservar em um voo cancelado', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    await request(app.getHttpServer())
      .put(`/api/voos/${vooId}`)
      .send({ status: 'CANCELADO' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId, passageiroId, numeroPassageiros: 1 })
      .expect(400);
  });

  it('deve cancelar uma reserva e restaurar os assentos do voo', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const reserva = await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId, passageiroId, numeroPassageiros: 3 })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/api/reservas/${reserva.body.id}`)
      .send({ status: 'CANCELADA' })
      .expect(200)
      .expect(res => expect(res.body.status).toBe('CANCELADA'));

    const voo = await request(app.getHttpServer()).get(`/api/voos/${vooId}`).expect(200);
    expect(voo.body.assentosDisponiveis).toBe(100);
  });

  it('deve deletar uma reserva confirmada e restaurar os assentos do voo', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const reserva = await request(app.getHttpServer())
      .post('/api/reservas')
      .send({ vooId, passageiroId, numeroPassageiros: 5 })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/reservas/${reserva.body.id}`)
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    const voo = await request(app.getHttpServer()).get(`/api/voos/${vooId}`).expect(200);
    expect(voo.body.assentosDisponiveis).toBe(100);

    await request(app.getHttpServer()).get(`/api/reservas/${reserva.body.id}`).expect(404);
  });

  it('deve listar reservas de forma paginada', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo({ assentosDisponiveis: 1000 });

    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/api/reservas')
        .send({ vooId, passageiroId, numeroPassageiros: 1 })
        .expect(201);
    }

    const resposta = await request(app.getHttpServer())
      .get('/api/reservas?page=1&limit=2')
      .expect(200);

    expect(resposta.body.data).toHaveLength(2);
    expect(resposta.body.total).toBe(3);
    expect(resposta.body.totalPages).toBe(2);
  });
});
