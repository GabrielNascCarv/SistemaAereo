import { useEffect, useState } from 'react';
import { listarReservas, cancelarReserva, deletarReserva } from '../api/reservas';
import { ApiError } from '../api/client';
import type { Reserva } from '../types/api';
import { Botao } from '../components/Botao';

const LIMITE_POR_PAGINA = 15;

const ROTULO_STATUS: Record<Reserva['status'], string> = {
  PENDENTE_PAGAMENTO: 'Pendente de pagamento',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
};

const COR_STATUS: Record<Reserva['status'], string> = {
  PENDENTE_PAGAMENTO: 'bg-amber-100 text-amber-800',
  CONFIRMADA: 'bg-emerald-100 text-emerald-800',
  CANCELADA: 'bg-slate-200 text-slate-600',
};

function formatarHorario(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ReservasPage() {
  const [pagina, setPagina] = useState(1);
  const [resultado, setResultado] = useState<{ data: Reserva[]; total: number; totalPages: number } | null>(
    null,
  );
  const [erro, setErro] = useState<string | null>(null);
  const [processando, setProcessando] = useState<number | null>(null);

  function carregar(paginaAlvo: number) {
    setResultado(null);
    setErro(null);
    listarReservas({ page: paginaAlvo, limit: LIMITE_POR_PAGINA })
      .then(setResultado)
      .catch((erro: unknown) => {
        setErro(
          erro instanceof ApiError ? erro.message : 'Não foi possível carregar as reservas.',
        );
      });
  }

  useEffect(() => {
    carregar(pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  async function handleCancelar(id: number) {
    setProcessando(id);
    try {
      await cancelarReserva(id);
      carregar(pagina);
    } catch (erro) {
      setErro(erro instanceof ApiError ? erro.message : 'Não foi possível cancelar a reserva.');
    } finally {
      setProcessando(null);
    }
  }

  async function handleExcluir(id: number) {
    setProcessando(id);
    try {
      await deletarReserva(id);
      carregar(pagina);
    } catch (erro) {
      setErro(erro instanceof ApiError ? erro.message : 'Não foi possível excluir a reserva.');
    } finally {
      setProcessando(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reservas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Todas as reservas feitas neste banco — o projeto não tem login, então esta lista é pública
        (como o resto da API).
      </p>
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        ⚠️ Demonstração de portfólio — os dados aqui são de teste, não use dados reais ao fazer uma
        reserva.
      </div>

      {erro && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {!erro && resultado === null && (
        <p className="mt-8 text-sm text-slate-500">Carregando…</p>
      )}

      {!erro && resultado !== null && resultado.data.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">Nenhuma reserva ainda.</p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {resultado?.data.map((reserva) => {
          const ida = reserva.trechos
            .filter((t) => t.direcao === 'IDA')
            .sort((a, b) => a.ordem - b.ordem);
          const volta = reserva.trechos
            .filter((t) => t.direcao === 'VOLTA')
            .sort((a, b) => a.ordem - b.ordem);
          const precoTotal = reserva.trechos.reduce((total, t) => total + t.voo.preco, 0);

          return (
            <li key={reserva.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-medium">{reserva.codigoReserva}</p>
                  <p className="text-xs text-slate-500">
                    passageiro #{reserva.passageiroId} · {reserva.numeroPassageiros} passageiro(s) ·{' '}
                    {formatarHorario(reserva.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${COR_STATUS[reserva.status]}`}
                >
                  {ROTULO_STATUS[reserva.status]}
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ida.length > 0 && (
                  <p className="text-sm text-slate-600">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Ida{' '}
                    </span>
                    {ida[0].voo.origem} → {ida[ida.length - 1].voo.destino}
                  </p>
                )}
                {volta.length > 0 && (
                  <p className="text-sm text-slate-600">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Volta{' '}
                    </span>
                    {volta[0].voo.origem} → {volta[volta.length - 1].voo.destino}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold">
                  {(precoTotal * reserva.numeroPassageiros).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>

                <div className="flex gap-2">
                  {reserva.status !== 'CANCELADA' && (
                    <Botao
                      variante="secundario"
                      disabled={processando === reserva.id}
                      onClick={() => handleCancelar(reserva.id)}
                    >
                      Cancelar
                    </Botao>
                  )}
                  <Botao
                    variante="secundario"
                    disabled={processando === reserva.id}
                    onClick={() => handleExcluir(reserva.id)}
                    className="text-red-600"
                  >
                    Excluir
                  </Botao>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {resultado && resultado.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
            className="text-slate-500 hover:text-slate-900 disabled:opacity-30"
          >
            ← anterior
          </button>
          <span className="text-slate-400">
            página {pagina} de {resultado.totalPages}
          </span>
          <button
            disabled={pagina >= resultado.totalPages}
            onClick={() => setPagina((p) => p + 1)}
            className="text-slate-500 hover:text-slate-900 disabled:opacity-30"
          >
            próxima →
          </button>
        </div>
      )}
    </div>
  );
}
