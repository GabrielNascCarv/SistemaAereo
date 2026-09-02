import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buscarOfertas } from '../api/voos-externos';
import { ApiError } from '../api/client';
import type { OfertaVoo } from '../types/api';
import { Botao } from '../components/Botao';
import { useFluxoReserva } from '../context/fluxo-reserva.context';

function formatarHorario(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ResultadosPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setOferta } = useFluxoReserva();

  const origem = searchParams.get('origem') ?? '';
  const destino = searchParams.get('destino') ?? '';
  const data = searchParams.get('data') ?? '';

  const [ofertas, setOfertas] = useState<OfertaVoo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!origem || !destino || !data) return;

    setOfertas(null);
    setErro(null);
    buscarOfertas({ origem, destino, data })
      .then(setOfertas)
      .catch((erro: unknown) => {
        setErro(
          erro instanceof ApiError
            ? erro.message
            : 'Não foi possível buscar voos agora. Tente novamente.',
        );
      });
  }, [origem, destino, data]);

  function selecionar(oferta: OfertaVoo) {
    setOferta(oferta);
    navigate('/reservar');
  }

  const diretas = ofertas?.filter((oferta) => oferta.destino === destino) ?? [];
  const comConexao = (ofertas?.length ?? 0) - diretas.length;

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← nova busca
      </button>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        {origem} → {destino}
      </h1>
      <p className="text-sm text-slate-500">{data}</p>

      {erro && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {!erro && ofertas === null && (
        <p className="mt-8 text-sm text-slate-500">Buscando voos na Duffel…</p>
      )}

      {!erro && ofertas !== null && diretas.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">
          Nenhum voo direto encontrado para essa rota e data. Tente outra combinação.
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {diretas.map((oferta) => (
          <li
            key={oferta.ofertaId}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">
                {oferta.companhia} · {oferta.numeroVoo}
              </p>
              <p className="text-sm text-slate-500">
                {formatarHorario(oferta.dataPartida)} → {formatarHorario(oferta.dataChegada)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                {oferta.preco.toLocaleString('pt-BR', { style: 'currency', currency: oferta.moeda })}
              </span>
              <Botao onClick={() => selecionar(oferta)}>Selecionar</Botao>
            </div>
          </li>
        ))}
      </ul>

      {comConexao > 0 && (
        <p className="mt-6 text-xs text-slate-400">
          {comConexao} oferta(s) com conexão foram ocultadas — este projeto modela apenas voos
          diretos.
        </p>
      )}
    </div>
  );
}
