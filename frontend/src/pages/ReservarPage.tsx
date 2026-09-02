import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFluxoReserva } from '../context/fluxo-reserva.context';
import { importarOferta } from '../api/voos-externos';
import { criarPassageiro } from '../api/passageiros';
import { criarReserva } from '../api/reservas';
import { ApiError } from '../api/client';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';

export function ReservarPage() {
  const navigate = useNavigate();
  const { oferta, setVoo, setReserva } = useFluxoReserva();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [numeroPassageiros, setNumeroPassageiros] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!oferta) navigate('/');
  }, [oferta, navigate]);

  if (!oferta) return null;

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const voo = await importarOferta(oferta!.ofertaId);
      const passageiro = await criarPassageiro({
        nome,
        email,
        cpf,
        telefone: telefone || undefined,
      });
      const reserva = await criarReserva({
        vooId: voo.id,
        passageiroId: passageiro.id,
        numeroPassageiros,
      });

      setVoo(voo);
      setReserva(reserva);
      navigate('/confirmacao');
    } catch (erro) {
      setErro(erro instanceof ApiError ? erro.message : 'Não foi possível concluir a reserva.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-900">
        ← voltar
      </button>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Seus dados</h1>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p className="font-medium">
          {oferta.companhia} · {oferta.numeroVoo}
        </p>
        <p className="text-sm text-slate-500">
          {oferta.origem} → {oferta.destino}
        </p>
        <p className="mt-1 font-semibold">
          {oferta.preco.toLocaleString('pt-BR', { style: 'currency', currency: oferta.moeda })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <Campo label="Nome completo" required value={nome} onChange={(e) => setNome(e.target.value)} />
        <Campo
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            label="CPF"
            placeholder="000.000.000-00"
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <Campo
            label="Telefone (opcional)"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <Campo
          label="Número de passageiros"
          type="number"
          min={1}
          required
          value={numeroPassageiros}
          onChange={(e) => setNumeroPassageiros(Number(e.target.value))}
        />

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <Botao type="submit" disabled={enviando} className="w-full sm:w-auto">
          {enviando ? 'Reservando…' : 'Reservar'}
        </Botao>
      </form>
    </div>
  );
}
