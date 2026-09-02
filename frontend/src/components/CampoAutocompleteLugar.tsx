import { useEffect, useRef, useState } from 'react';
import { buscarLugares } from '../api/voos-externos';
import type { SugestaoLugar } from '../types/api';

interface Props {
  label: string;
  placeholder?: string;
  onSelecionar: (lugar: SugestaoLugar) => void;
}

export function CampoAutocompleteLugar({ label, placeholder, onSelecionar }: Props) {
  const [texto, setTexto] = useState('');
  const [sugestoes, setSugestoes] = useState<SugestaoLugar[]>([]);
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    if (texto.trim().length < 2) {
      setSugestoes([]);
      return;
    }

    setCarregando(true);
    timeoutRef.current = window.setTimeout(() => {
      buscarLugares(texto.trim())
        .then((resultado) => {
          setSugestoes(resultado);
          setAberto(true);
        })
        .catch(() => setSugestoes([]))
        .finally(() => setCarregando(false));
    }, 300);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [texto]);

  function selecionar(lugar: SugestaoLugar) {
    const rotulo =
      lugar.tipo === 'city'
        ? `${lugar.nome} (${lugar.iataCode})`
        : `${lugar.nome} — ${lugar.cidade ?? ''} (${lugar.iataCode})`;
    setTexto(rotulo);
    setAberto(false);
    onSelecionar(lugar);
  }

  return (
    <div className="relative flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
        placeholder={placeholder}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onFocus={() => sugestoes.length > 0 && setAberto(true)}
        onBlur={() => window.setTimeout(() => setAberto(false), 150)}
      />

      {aberto && (carregando || sugestoes.length > 0) && (
        <ul className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {carregando && <li className="px-3 py-2 text-xs text-slate-400">Buscando…</li>}
          {!carregando &&
            sugestoes.map((lugar) => (
              <li key={lugar.iataCode + lugar.tipo + lugar.nome}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selecionar(lugar)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  <span className="font-medium">
                    {lugar.nome} <span className="text-slate-400">({lugar.iataCode})</span>
                  </span>
                  {lugar.cidade && lugar.cidade !== lugar.nome && (
                    <span className="text-xs text-slate-500">{lugar.cidade}</span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
