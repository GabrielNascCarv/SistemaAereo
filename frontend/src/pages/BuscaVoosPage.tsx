import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampoAutocompleteLugar } from '../components/CampoAutocompleteLugar';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';

export function BuscaVoosPage() {
  const navigate = useNavigate();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [idaEVolta, setIdaEVolta] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!origem || !destino) {
      setErro('Selecione uma cidade ou aeroporto de origem e destino na lista sugerida');
      return;
    }
    if (!dataIda) {
      setErro('Escolha a data de ida');
      return;
    }
    if (idaEVolta && !dataVolta) {
      setErro('Escolha a data de volta');
      return;
    }

    const query = new URLSearchParams({
      origem,
      destino,
      dataIda,
      ...(idaEVolta && dataVolta ? { dataVolta } : {}),
    });
    navigate(`/resultados?${query.toString()}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Para onde vamos?</h1>
      <p className="mt-1 text-sm text-slate-500">
        Busca voos reais via a integração com a Duffel API (ambiente de teste).
      </p>

      <label className="mt-6 flex w-fit items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={idaEVolta}
          onChange={(e) => setIdaEVolta(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Ida e volta
      </label>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <CampoAutocompleteLugar
          label="Origem"
          placeholder="Digite uma cidade ou aeroporto"
          onSelecionar={(lugar) => setOrigem(lugar.iataCode)}
        />
        <CampoAutocompleteLugar
          label="Destino"
          placeholder="Digite uma cidade ou aeroporto"
          onSelecionar={(lugar) => setDestino(lugar.iataCode)}
        />
        <Campo
          label="Data de ida"
          type="date"
          value={dataIda}
          onChange={(e) => setDataIda(e.target.value)}
        />
        {idaEVolta && (
          <Campo
            label="Data de volta"
            type="date"
            value={dataVolta}
            onChange={(e) => setDataVolta(e.target.value)}
          />
        )}

        {erro && <p className="sm:col-span-2 text-sm text-red-600">{erro}</p>}

        <div className="sm:col-span-2">
          <Botao type="submit" className="w-full sm:w-auto">
            Buscar voos
          </Botao>
        </div>
      </form>

      <p className="mt-10 text-xs text-slate-400">
        Dica: no ambiente de teste da Duffel, rotas conhecidas como Londres → Nova York costumam
        ter bons resultados.
      </p>
    </div>
  );
}
