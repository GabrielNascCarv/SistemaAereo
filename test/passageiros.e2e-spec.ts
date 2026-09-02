import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { criarAppTeste } from './utils/criar-app-teste.util';
import { limparBanco, prismaTeste } from './utils/prisma-test.util';
import { corpoComo } from './utils/corpo.util';
import { PassageiroResponseDto } from '../src/modules/passageiros/dto/passageiro-response.dto';
import { PaginaResultadoDto } from '../src/core/common/dto/pagina-resultado.dto';

describe('Passageiros (e2e)', () => {
  let app: INestApplication<App>;

  const passageiroValido = {
    nome: 'João Silva',
    email: 'joao@teste.com',
    cpf: '123.456.789-01',
    telefone: '(11) 91234-5678',
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

  it('deve criar um passageiro', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/api/passageiros')
      .send(passageiroValido)
      .expect(201);

    const passageiro = corpoComo<PassageiroResponseDto>(resposta);

    expect(passageiro).toMatchObject({
      nome: passageiroValido.nome,
      email: passageiroValido.email,
      cpf: passageiroValido.cpf,
    });
    expect(passageiro.id).toBeDefined();
  });

  it('deve rejeitar payload inválido com 400', async () => {
    await request(app.getHttpServer())
      .post('/api/passageiros')
      .send({ nome: 'A', email: 'não-é-email', cpf: '123' })
      .expect(400);
  });

  it('deve rejeitar email duplicado com 409', async () => {
    await request(app.getHttpServer())
      .post('/api/passageiros')
      .send(passageiroValido)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/passageiros')
      .send({ ...passageiroValido, cpf: '987.654.321-00' })
      .expect(409);
  });

  it('deve listar passageiros de forma paginada', async () => {
    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/api/passageiros')
        .send({
          ...passageiroValido,
          email: `passageiro${i}@teste.com`,
          cpf: `111.111.111-0${i}`,
        })
        .expect(201);
    }

    const resposta = await request(app.getHttpServer())
      .get('/api/passageiros?page=1&limit=2')
      .expect(200);

    const pagina =
      corpoComo<PaginaResultadoDto<PassageiroResponseDto>>(resposta);

    expect(pagina.data).toHaveLength(2);
    expect(pagina.total).toBe(3);
    expect(pagina.page).toBe(1);
    expect(pagina.limit).toBe(2);
    expect(pagina.totalPages).toBe(2);
  });

  it('deve buscar, atualizar e deletar um passageiro (fluxo completo)', async () => {
    const criado = await request(app.getHttpServer())
      .post('/api/passageiros')
      .send(passageiroValido)
      .expect(201);
    const { id } = corpoComo<PassageiroResponseDto>(criado);

    await request(app.getHttpServer())
      .get(`/api/passageiros/${id}`)
      .expect(200)
      .expect((res) =>
        expect(corpoComo<PassageiroResponseDto>(res).email).toBe(
          passageiroValido.email,
        ),
      );

    await request(app.getHttpServer())
      .put(`/api/passageiros/${id}`)
      .send({ nome: 'João Souza' })
      .expect(200)
      .expect((res) =>
        expect(corpoComo<PassageiroResponseDto>(res).nome).toBe('João Souza'),
      );

    await request(app.getHttpServer())
      .delete(`/api/passageiros/${id}`)
      .expect(200)
      .expect((res) =>
        expect(corpoComo<{ success: boolean }>(res).success).toBe(true),
      );

    await request(app.getHttpServer())
      .get(`/api/passageiros/${id}`)
      .expect(404);
  });

  it('deve retornar 404 ao buscar um passageiro inexistente', async () => {
    await request(app.getHttpServer())
      .get('/api/passageiros/999999')
      .expect(404);
  });
});
