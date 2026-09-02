import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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

    if (origem.trim().length !== 3 || destino.trim().length !== 3) {
      setErro('Origem e destino devem ser códigos IATA de 3 letras (ex: GRU, JFK, LHR)');
      return;
    }
    if (!data) {
      setErro('Escolha uma data');
      return;
    }

    const query = new URLSearchParams({
      origem: origem.trim().toUpperCase(),
      destino: destino.trim().toUpperCase(),
      data,
    });
    navigate(`/resultados?${query.toString()}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Para onde vamos?</h1>
      <p className="mt-1 text-sm text-slate-500">
        Busca voos reais via a integração com a Duffel API (ambiente de teste).
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-3">
        <Campo
          label="Origem"
          placeholder="GRU"
          maxLength={3}
          value={origem}
          onChange={(e) => setOrigem(e.target.value.toUpperCase())}
        />
        <Campo
          label="Destino"
          placeholder="JFK"
          maxLength={3}
          value={destino}
          onChange={(e) => setDestino(e.target.value.toUpperCase())}
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
        Dica: no ambiente de teste da Duffel, rotas conhecidas como LHR → JFK costumam ter bons
        resultados.
      </p>
    </div>
  );
}
