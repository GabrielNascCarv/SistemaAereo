import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFluxoReserva } from '../context/fluxo-reserva.context';
import { Botao } from '../components/Botao';

export function ConfirmacaoPage() {
  const navigate = useNavigate();
  const { oferta, voo, reserva } = useFluxoReserva();

  useEffect(() => {
    if (!voo || !reserva) navigate('/');
  }, [voo, reserva, navigate]);

  if (!voo || !reserva) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reserva efetuada 🎉</h1>
      <p className="mt-1 text-sm text-slate-500">
        Código da reserva: <span className="font-mono font-medium">{reserva.codigoReserva}</span>
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            {voo.numeroVoo} · {voo.origem} → {voo.destino}
          </p>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Pendente de pagamento
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {reserva.numeroPassageiros} passageiro(s) ·{' '}
          {new Date(voo.dataPartida).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="mt-3 text-lg font-semibold">
          {(voo.preco * reserva.numeroPassageiros).toLocaleString('pt-BR', {
            style: 'currency',
            // O modelo Voo não guarda moeda — usamos a da oferta original
            // (Duffel), com BRL como fallback se a página for recarregada.
            currency: oferta?.moeda ?? 'BRL',
          })}
        </p>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        O assento já está reservado para você. Para confirmar de vez, falta o pagamento.
      </p>

      <Botao onClick={() => navigate('/pagamento')} className="mt-4">
        Efetuar pagamento
      </Botao>
    </div>
  );
}
