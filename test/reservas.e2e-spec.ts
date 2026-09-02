import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { criarAppTeste } from './utils/criar-app-teste.util';
import { limparBanco, prismaTeste } from './utils/prisma-test.util';
import { corpoComo } from './utils/corpo.util';
import { ReservaResponseDto } from '../src/modules/reservas/dto/reserva-response.dto';
import { VooResponseDto } from '../src/modules/voos/dto/voo-response.dto';
import { PassageiroResponseDto } from '../src/modules/passageiros/dto/passageiro-response.dto';
import { PaginaResultadoDto } from '../src/core/common/dto/pagina-resultado.dto';

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

  async function criarPassageiro(): Promise<number> {
    const resposta = await request(app.getHttpServer())
      .post('/api/passageiros')
      .send(passageiroValido)
      .expect(201);
    return corpoComo<PassageiroResponseDto>(resposta).id;
  }

  async function criarVoo(
    overrides: Partial<typeof vooValido> = {},
  ): Promise<number> {
    const resposta = await request(app.getHttpServer())
      .post('/api/voos')
      .send({ ...vooValido, ...overrides })
      .expect(201);
    return corpoComo<VooResponseDto>(resposta).id;
  }

  function reservar(
    passageiroId: number,
    numeroPassageiros: number,
    vooId: number,
  ) {
    return request(app.getHttpServer())
      .post('/api/reservas')
      .send({
        passageiroId,
        numeroPassageiros,
        trechos: [{ vooId, direcao: 'IDA', ordem: 1 }],
      });
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

  it('deve criar uma reserva pendente de pagamento e decrementar os assentos disponíveis do voo', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const resposta = await reservar(passageiroId, 2, vooId).expect(201);
    const reserva = corpoComo<ReservaResponseDto>(resposta);

    expect(reserva).toMatchObject({
      status: 'PENDENTE_PAGAMENTO',
      numeroPassageiros: 2,
      passageiroId,
    });
    expect(reserva.codigoReserva).toMatch(/^RES-/);
    expect(reserva.trechos).toHaveLength(1);
    expect(reserva.trechos[0]).toMatchObject({
      vooId,
      direcao: 'IDA',
      ordem: 1,
    });

    const vooResposta = await request(app.getHttpServer())
      .get(`/api/voos/${vooId}`)
      .expect(200);
    expect(corpoComo<VooResponseDto>(vooResposta).assentosDisponiveis).toBe(98);
  });

  it('deve criar uma reserva de ida e volta com dois trechos', async () => {
    const passageiroId = await criarPassageiro();
    const vooIda = await criarVoo({ numeroVoo: 'AB111' });
    const vooVolta = await criarVoo({
      numeroVoo: 'AB222',
      origem: 'GIG',
      destino: 'GRU',
    });

    const resposta = await request(app.getHttpServer())
      .post('/api/reservas')
      .send({
        passageiroId,
        numeroPassageiros: 1,
        trechos: [
          { vooId: vooIda, direcao: 'IDA', ordem: 1 },
          { vooId: vooVolta, direcao: 'VOLTA', ordem: 1 },
        ],
      })
      .expect(201);
    const reserva = corpoComo<ReservaResponseDto>(resposta);

    expect(reserva.trechos).toHaveLength(2);
    expect(reserva.trechos.find((t) => t.direcao === 'IDA')?.vooId).toBe(
      vooIda,
    );
    expect(reserva.trechos.find((t) => t.direcao === 'VOLTA')?.vooId).toBe(
      vooVolta,
    );

    const [respostaIda, respostaVolta] = await Promise.all([
      request(app.getHttpServer()).get(`/api/voos/${vooIda}`).expect(200),
      request(app.getHttpServer()).get(`/api/voos/${vooVolta}`).expect(200),
    ]);
    expect(corpoComo<VooResponseDto>(respostaIda).assentosDisponiveis).toBe(99);
    expect(corpoComo<VooResponseDto>(respostaVolta).assentosDisponiveis).toBe(
      99,
    );
  });

  it('deve retornar 404 ao reservar em um voo inexistente', async () => {
    const passageiroId = await criarPassageiro();

    await reservar(passageiroId, 1, 999999).expect(404);
  });

  it('deve retornar 404 ao reservar para um passageiro inexistente', async () => {
    const vooId = await criarVoo();

    await reservar(999999, 1, vooId).expect(404);
  });

  it('deve retornar 400 quando não há assentos suficientes', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo({ assentosDisponiveis: 1 });

    await reservar(passageiroId, 2, vooId).expect(400);
  });

  it('deve retornar 400 ao reservar em um voo cancelado', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    await request(app.getHttpServer())
      .put(`/api/voos/${vooId}`)
      .send({ status: 'CANCELADO' })
      .expect(200);

    await reservar(passageiroId, 1, vooId).expect(400);
  });

  it('deve cancelar uma reserva e restaurar os assentos do voo', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const criada = await reservar(passageiroId, 3, vooId).expect(201);
    const { id } = corpoComo<ReservaResponseDto>(criada);

    await request(app.getHttpServer())
      .put(`/api/reservas/${id}`)
      .send({ status: 'CANCELADA' })
      .expect(200)
      .expect((res) =>
        expect(corpoComo<ReservaResponseDto>(res).status).toBe('CANCELADA'),
      );

    const vooResposta = await request(app.getHttpServer())
      .get(`/api/voos/${vooId}`)
      .expect(200);
    expect(corpoComo<VooResponseDto>(vooResposta).assentosDisponiveis).toBe(
      100,
    );
  });

  it('deve deletar uma reserva ativa e restaurar os assentos do voo', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const criada = await reservar(passageiroId, 5, vooId).expect(201);
    const { id } = corpoComo<ReservaResponseDto>(criada);

    await request(app.getHttpServer())
      .delete(`/api/reservas/${id}`)
      .expect(200)
      .expect((res) =>
        expect(corpoComo<{ success: boolean }>(res).success).toBe(true),
      );

    const vooResposta = await request(app.getHttpServer())
      .get(`/api/voos/${vooId}`)
      .expect(200);
    expect(corpoComo<VooResponseDto>(vooResposta).assentosDisponiveis).toBe(
      100,
    );

    await request(app.getHttpServer()).get(`/api/reservas/${id}`).expect(404);
  });

  it('deve listar reservas de forma paginada', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo({ assentosDisponiveis: 1000 });

    for (let i = 0; i < 3; i++) {
      await reservar(passageiroId, 1, vooId).expect(201);
    }

    const resposta = await request(app.getHttpServer())
      .get('/api/reservas?page=1&limit=2')
      .expect(200);
    const pagina = corpoComo<PaginaResultadoDto<ReservaResponseDto>>(resposta);

    expect(pagina.data).toHaveLength(2);
    expect(pagina.total).toBe(3);
    expect(pagina.totalPages).toBe(2);
  });

  it('deve impedir alterar as datas de um voo com reserva ativa', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    await reservar(passageiroId, 1, vooId).expect(201);

    await request(app.getHttpServer())
      .put(`/api/voos/${vooId}`)
      .send({ dataPartida: '2026-12-01T10:00:00.000Z' })
      .expect(400);
  });

  it('deve permitir alterar outros campos do voo mesmo com reserva ativa', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    await reservar(passageiroId, 1, vooId).expect(201);

    await request(app.getHttpServer())
      .put(`/api/voos/${vooId}`)
      .send({ preco: 699.9 })
      .expect(200);
  });

  it('deve permitir alterar as datas do voo após a reserva ser cancelada', async () => {
    const passageiroId = await criarPassageiro();
    const vooId = await criarVoo();

    const criada = await reservar(passageiroId, 1, vooId).expect(201);
    const { id } = corpoComo<ReservaResponseDto>(criada);

    await request(app.getHttpServer())
      .put(`/api/reservas/${id}`)
      .send({ status: 'CANCELADA' })
      .expect(200);

    await request(app.getHttpServer())
      .put(`/api/voos/${vooId}`)
      .send({ dataPartida: '2026-12-01T10:00:00.000Z' })
      .expect(200);
  });
});
