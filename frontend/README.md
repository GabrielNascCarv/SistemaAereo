# Sistema Aéreo — Frontend

SPA em React que consome a [API do Sistema Aéreo](../README.md). Não é um projeto de e-commerce real: é a demonstração visual do backend, terminando de propósito numa tela de "gateway de pagamento fora de escopo".

## Stack

Vite + React 19 + TypeScript + Tailwind v4 + React Router.

## Fluxo

```
Busca (Duffel ao vivo) → Resultados → Dados do passageiro
  → Reserva criada (PENDENTE_PAGAMENTO) → Efetuar pagamento → fim do projeto
```

- A busca de voos filtra no cliente para mostrar só ofertas diretas (o backend não modela itinerários com conexão).
- Selecionar uma oferta importa o voo pra dentro do banco do backend (`POST /voos-externos/importar`) e, na sequência, cria o passageiro e a reserva de verdade.
- Não existe gateway de pagamento: a última tela explica isso ao usuário em vez de fingir uma cobrança.

## Rodando localmente

Precisa do [backend](../README.md) rodando em paralelo (`npm run start:dev` na raiz do repo).

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se a API não estiver em localhost:3000
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
