import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFluxoReserva } from '../context/fluxo-reserva.context';
import { Botao } from '../components/Botao';

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{titulo}</h2>
      <div className="mt-3 text-sm text-slate-600">{children}</div>
    </section>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

export function PagamentoPage() {
  const navigate = useNavigate();
  const { reiniciar } = useFluxoReserva();

  function voltarAoInicio() {
    reiniciar();
    navigate('/');
  }

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <span className="text-5xl" aria-hidden>
          🚧
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">O projeto termina aqui</h1>
        <p className="mt-3 max-w-lg text-sm text-slate-600">
          Este é um projeto de portfólio. Implementar um gateway de pagamento real (Stripe, Mercado
          Pago…) fica fora do escopo — a reserva que você acabou de fazer existe de verdade no
          banco de dados, só não vira uma cobrança de fato. Abaixo, o que roda por trás da tela.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Secao titulo="Stack">
          <p className="font-medium text-slate-800">Backend</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge>NestJS</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Prisma</Badge>
            <Badge>PostgreSQL</Badge>
            <Badge>Jest</Badge>
            <Badge>Supertest</Badge>
          </div>
          <p className="mt-3 font-medium text-slate-800">Frontend</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge>React 19</Badge>
            <Badge>Vite</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Tailwind v4</Badge>
            <Badge>React Router</Badge>
          </div>
        </Secao>

        <Secao titulo="Arquitetura">
          <p>
            Backend em camadas por módulo (<code className="text-xs">passageiros</code>,{' '}
            <code className="text-xs">voos</code>, <code className="text-xs">reservas</code>,{' '}
            <code className="text-xs">voos-externos</code>): controller → use-case → repository,
            com contracts (interfaces) e DTOs de entrada/saída separados da entidade de domínio.
          </p>
          <p className="mt-2">
            Cada regra de negócio mora em um use-case dedicado — um arquivo por operação — testado
            isoladamente com os repositórios mockados.
          </p>
        </Secao>

        <Secao titulo="Modelo de dados">
          <p>
            <span className="font-medium text-slate-800">Voo</span> é sempre um trecho atômico
            (uma decolagem, um pouso). Conexões e itinerários de ida-e-volta não são propriedade do
            voo — são modelados numa tabela de junção,{' '}
            <span className="font-medium text-slate-800">ReservaTrecho</span>{' '}
            <code className="text-xs">{'{ reservaId, vooId, direcao, ordem }'}</code>, que liga uma
            reserva a N voos em ordem. O mesmo voo pode ser reaproveitado em itinerários diferentes
            sem duplicar linha no banco.
          </p>
          <p className="mt-2">
            Reserva nasce como <code className="text-xs">PENDENTE_PAGAMENTO</code> e já reserva o
            assento; cancelar ou deletar restaura os assentos em todos os trechos.
          </p>
        </Secao>

        <Secao titulo="Busca de voos reais">
          <p>
            A listagem de voos e o autocomplete de cidade/aeroporto vêm da{' '}
            <span className="font-medium text-slate-800">Duffel API</span> (ambiente de teste) —
            sem dado mockado. Ao escolher uma oferta, cada trecho é importado sob demanda pra
            tabela <code className="text-xs">voos</code> (idempotente por número + data de
            partida), só então vira uma reserva de verdade.
          </p>
        </Secao>
      </div>

      <div className="mt-6 flex justify-center">
        <Botao onClick={voltarAoInicio}>Voltar ao início</Botao>
      </div>
    </div>
  );
}
