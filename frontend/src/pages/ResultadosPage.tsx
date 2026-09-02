import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { buscarOfertas } from '../api/voos-externos';
import { ApiError } from '../api/client';
import type { OfertaVoo, SliceOferta } from '../types/api';
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

function duracaoTotalMinutos(oferta: OfertaVoo): number {
  return oferta.slices.reduce((total, slice) => {
    const partida = new Date(slice.segmentos[0].dataPartida).getTime();
    const chegada = new Date(slice.segmentos[slice.segmentos.length - 1].dataChegada).getTime();
    return total + (chegada - partida) / 60000;
  }, 0);
}

function totalConexoes(oferta: OfertaVoo): number {
  return oferta.slices.reduce((total, slice) => total + (slice.segmentos.length - 1), 0);
}

const OPCOES_ORDENACAO = {
  'preco-asc': { rotulo: 'Menor preço', comparar: (a: OfertaVoo, b: OfertaVoo) => a.preco - b.preco },
  'preco-desc': { rotulo: 'Maior preço', comparar: (a: OfertaVoo, b: OfertaVoo) => b.preco - a.preco },
  'duracao-asc': {
    rotulo: 'Mais rápido',
    comparar: (a: OfertaVoo, b: OfertaVoo) => duracaoTotalMinutos(a) - duracaoTotalMinutos(b),
  },
  'conexoes-asc': {
    rotulo: 'Menos conexões',
    comparar: (a: OfertaVoo, b: OfertaVoo) => totalConexoes(a) - totalConexoes(b),
  },
  'partida-asc': {
    rotulo: 'Saída mais cedo',
    comparar: (a: OfertaVoo, b: OfertaVoo) =>
      new Date(a.slices[0].segmentos[0].dataPartida).getTime() -
      new Date(b.slices[0].segmentos[0].dataPartida).getTime(),
  },
} as const;

type ChaveOrdenacao = keyof typeof OPCOES_ORDENACAO;

function ResumoSlice({ slice }: { slice: SliceOferta }) {
  const primeiro = slice.segmentos[0];
  const ultimo = slice.segmentos[slice.segmentos.length - 1];
  const escalas = slice.segmentos.length - 1;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {slice.direcao === 'IDA' ? 'Ida' : 'Volta'}
      </p>
      <p className="font-medium">
        {primeiro.origem} → {ultimo.destino}
      </p>
      <p className="text-sm text-slate-500">
        {formatarHorario(primeiro.dataPartida)} → {formatarHorario(ultimo.dataChegada)} ·{' '}
        {escalas === 0 ? 'direto' : `${escalas} conexão(ões)`}
      </p>
      {escalas > 0 && (
        <p className="mt-1 text-xs text-slate-400">
          {slice.segmentos.map((s) => `${s.numeroVoo} (${s.origem}→${s.destino})`).join('  ·  ')}
        </p>
      )}
    </div>
  );
}

export function ResultadosPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setOferta } = useFluxoReserva();

  const origem = searchParams.get('origem') ?? '';
  const destino = searchParams.get('destino') ?? '';
  const dataIda = searchParams.get('dataIda') ?? '';
  const dataVolta = searchParams.get('dataVolta') ?? undefined;

  const [ofertas, setOfertas] = useState<OfertaVoo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<ChaveOrdenacao>('preco-asc');

  useEffect(() => {
    if (!origem || !destino || !dataIda) return;

    setOfertas(null);
    setErro(null);
    buscarOfertas({ origem, destino, dataIda, dataVolta })
      .then(setOfertas)
      .catch((erro: unknown) => {
        setErro(
          erro instanceof ApiError
            ? erro.message
            : 'Não foi possível buscar voos agora. Tente novamente.',
        );
      });
  }, [origem, destino, dataIda, dataVolta]);

  const ofertasOrdenadas = useMemo(() => {
    if (!ofertas) return null;
    return [...ofertas].sort(OPCOES_ORDENACAO[ordenacao].comparar);
  }, [ofertas, ordenacao]);

  function selecionar(oferta: OfertaVoo) {
    setOferta(oferta);
    navigate('/reservar');
  }

  return (
    <div>
      <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-slate-900">
        ← nova busca
      </button>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {origem} → {destino}
            {dataVolta && ' → ' + origem}
          </h1>
          <p className="text-sm text-slate-500">
            {dataIda}
            {dataVolta && ` · volta em ${dataVolta}`}
          </p>
        </div>

        {ofertasOrdenadas && ofertasOrdenadas.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Ordenar por
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as ChaveOrdenacao)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              {Object.entries(OPCOES_ORDENACAO).map(([chave, { rotulo }]) => (
                <option key={chave} value={chave}>
                  {rotulo}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {erro && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {!erro && ofertasOrdenadas === null && (
        <p className="mt-8 text-sm text-slate-500">Buscando voos na Duffel…</p>
      )}

      {!erro && ofertasOrdenadas !== null && ofertasOrdenadas.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">
          Nenhum voo encontrado para essa rota e data. Tente outra combinação.
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {ofertasOrdenadas?.map((oferta) => (
          <li key={oferta.ofertaId} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                {oferta.slices.map((slice) => (
                  <ResumoSlice key={slice.direcao} slice={slice} />
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  {oferta.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: oferta.moeda,
                  })}
                </span>
                <Botao onClick={() => selecionar(oferta)}>Selecionar</Botao>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
