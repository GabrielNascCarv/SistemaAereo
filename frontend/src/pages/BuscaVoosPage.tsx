import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampoAutocompleteLugar } from '../components/CampoAutocompleteLugar';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';

export function BuscaVoosPage() {
  const navigate = useNavigate();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [data, setData] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (!origem || !destino) {
      setErro('Selecione uma cidade ou aeroporto de origem e destino na lista sugerida');
      return;
    }
    if (!data) {
      setErro('Escolha uma data');
      return;
    }

    const query = new URLSearchParams({ origem, destino, data });
    navigate(`/resultados?${query.toString()}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Para onde vamos?</h1>
      <p className="mt-1 text-sm text-slate-500">
        Busca voos reais via a integração com a Duffel API (ambiente de teste).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-3">
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
        <Campo label="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} />

        {erro && <p className="sm:col-span-3 text-sm text-red-600">{erro}</p>}

        <div className="sm:col-span-3">
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
