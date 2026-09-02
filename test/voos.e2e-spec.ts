import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { criarAppTeste } from './utils/criar-app-teste.util';
import { limparBanco, prismaTeste } from './utils/prisma-test.util';
import { corpoComo } from './utils/corpo.util';
import { VooResponseDto } from '../src/modules/voos/dto/voo-response.dto';
import { PaginaResultadoDto } from '../src/core/common/dto/pagina-resultado.dto';

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

    expect(corpoComo<VooResponseDto>(resposta)).toMatchObject({
      numeroVoo: vooValido.numeroVoo,
      status: 'AGENDADO',
      assentosDisponiveis: 100,
    });
  });

  it('deve rejeitar número de voo duplicado com 409', async () => {
    await request(app.getHttpServer())
      .post('/api/voos')
      .send(vooValido)
      .expect(201);

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

    const resposta = await request(app.getHttpServer())
      .get('/api/voos?page=1&limit=2')
      .expect(200);
    const pagina = corpoComo<PaginaResultadoDto<VooResponseDto>>(resposta);

    expect(pagina.data).toHaveLength(2);
    expect(pagina.total).toBe(3);
    expect(pagina.totalPages).toBe(2);
  });

  it('deve atualizar e deletar um voo (fluxo completo)', async () => {
    const criado = await request(app.getHttpServer())
      .post('/api/voos')
      .send(vooValido)
      .expect(201);
    const { id } = corpoComo<VooResponseDto>(criado);

    await request(app.getHttpServer())
      .put(`/api/voos/${id}`)
      .send({ preco: 599.9 })
      .expect(200)
      .expect((res) =>
        expect(corpoComo<VooResponseDto>(res).preco).toBe(599.9),
      );

    await request(app.getHttpServer())
      .delete(`/api/voos/${id}`)
      .expect(200)
      .expect((res) =>
        expect(corpoComo<{ success: boolean }>(res).success).toBe(true),
      );

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
    const { id } = corpoComo<VooResponseDto>(criado);

    const resposta = await request(app.getHttpServer())
      .get(`/api/voos/${id}`)
      .expect(200);

    expect(corpoComo<VooResponseDto>(resposta).status).toBe('CONCLUIDO');
  });

  it('deve retornar 404 ao buscar um voo inexistente', async () => {
    await request(app.getHttpServer()).get('/api/voos/999999').expect(404);
  });
});
