# Sistema Aéreo

API REST para gestão de um sistema aéreo — voos, passageiros e reservas — construída com [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/) e PostgreSQL.

## Arquitetura

O código está organizado por módulo de domínio (`passageiros`, `voos`, `reservas`), cada um seguindo a mesma estrutura em camadas:

```
src/modules/<modulo>/
├── controllers/     # rotas HTTP
├── use-cases/       # regra de negócio, um arquivo por operação
│   └── factory/      # fábricas dos use-cases (injeção manual)
├── repositories/     # acesso a dados via Prisma
├── contracts/         # interfaces (use-cases e repositórios)
├── dto/                # validação de entrada e formato de saída
└── entities/           # modelo de domínio
```

`src/core/database` concentra o `PrismaService`, e `src/core/common/dto` tem os DTOs de paginação reaproveitados pelos três módulos.

## Modelo de dados

Definido em [`prisma/schema.prisma`](prisma/schema.prisma):

- **Voo** — número, origem, destino, datas de partida/chegada, assentos disponíveis, preço, status (`AGENDADO`, `CANCELADO`, `CONCLUIDO`)
- **Passageiro** — nome, email, CPF, telefone
- **Reserva** — liga um Voo a um Passageiro, com código único, status (`CONFIRMADA`, `CANCELADA`) e número de passageiros

## Endpoints

Prefixo global: `/api`. Todas as listagens (`GET` sem `:id`) são paginadas — `?page=1&limit=15` (15 por página por padrão) — e retornam `{ data, total, page, limit, totalPages }`.

| Recurso | Rotas |
|---|---|
| Passageiros | `POST /api/passageiros` · `GET /api/passageiros` · `GET /api/passageiros/:id` · `PUT /api/passageiros/:id` · `DELETE /api/passageiros/:id` |
| Voos | `POST /api/voos` · `GET /api/voos` · `GET /api/voos/:id` · `PUT /api/voos/:id` · `DELETE /api/voos/:id` |
| Reservas | `POST /api/reservas` · `GET /api/reservas` · `GET /api/reservas/:id` · `PUT /api/reservas/:id` · `DELETE /api/reservas/:id` |

### Regras de negócio

- Email e CPF de passageiro são únicos; número de voo é único.
- Reserva: valida existência de voo e passageiro, checa assentos disponíveis, gera um código único (`RES-...`) e decrementa os assentos do voo.
- Reserva é bloqueada se o voo estiver `CANCELADO` ou `CONCLUIDO`.
- Cancelar (`PUT` com `status: CANCELADA`) ou deletar uma reserva confirmada restaura os assentos do voo.
- O status do voo muda automaticamente para `CONCLUIDO` quando consultado (`GET`) após a `dataChegada` já ter passado.
- Não é possível alterar `dataPartida`/`dataChegada` de um voo que já tenha reserva `CONFIRMADA`.

## Configuração

Requer Node.js 20+, PostgreSQL e npm.

```bash
npm install
cp .env.example .env
# edite .env com a DATABASE_URL do seu PostgreSQL
npx prisma migrate deploy
```

## Executando

```bash
npm run start:dev    # modo watch
npm run start        # padrão
npm run start:prod   # produção (requer build antes)
npm run build
```

## Testes

Suíte com testes unitários (Jest, use-cases mockando os repositórios) e e2e (Supertest, batendo na API real contra um banco de teste dedicado).

```bash
npm test              # unitários (src/**/*.spec.ts)
npm run test:watch    # unitários em modo watch
npm run test:cov      # unitários com cobertura
npm run test:e2e      # e2e (test/**/*.e2e-spec.ts)
```

O e2e usa `.env.test` (copie de `.env.test.example`) apontando para um banco **separado** do de desenvolvimento — o script `pretest:e2e` aplica as migrations nele automaticamente antes de rodar os testes, e cada teste limpa as tabelas (`test/utils/prisma-test.util.ts`) antes de rodar.

## Qualidade de código

```bash
npm run lint    # eslint --fix
npm run format  # prettier --write
```

## O que ainda falta

- Autenticação/autorização — a API está totalmente aberta
- CI (lint + testes rodando automaticamente em push/PR)
- Documentação OpenAPI/Swagger
