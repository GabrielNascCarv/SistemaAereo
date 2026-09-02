import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFluxoReserva } from '../context/fluxo-reserva.context';
import { Botao } from '../components/Botao';

function formatarHorario(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ConfirmacaoPage() {
  const navigate = useNavigate();
  const { oferta, reserva } = useFluxoReserva();

  useEffect(() => {
    if (!reserva) navigate('/');
  }, [reserva, navigate]);

  if (!reserva) return null;

  const precoTotal = reserva.trechos.reduce((total, trecho) => total + trecho.voo.preco, 0);
  const ida = reserva.trechos.filter((t) => t.direcao === 'IDA').sort((a, b) => a.ordem - b.ordem);
  const volta = reserva.trechos.filter((t) => t.direcao === 'VOLTA').sort((a, b) => a.ordem - b.ordem);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reserva efetuada 🎉</h1>
      <p className="mt-1 text-sm text-slate-500">
        Código da reserva: <span className="font-mono font-medium">{reserva.codigoReserva}</span>
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            {ida[0]?.voo.origem} → {ida[ida.length - 1]?.voo.destino}
            {volta.length > 0 && ` → ${ida[0]?.voo.origem}`}
          </p>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Pendente de pagamento
          </span>
        </div>

        {[ida, volta].map(
          (trechos, indice) =>
            trechos.length > 0 && (
              <div key={indice} className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {trechos[0].direcao === 'IDA' ? 'Ida' : 'Volta'}
                </p>
                {trechos.map((trecho) => (
                  <p key={trecho.vooId} className="text-sm text-slate-600">
                    {trecho.voo.numeroVoo} · {trecho.voo.origem} → {trecho.voo.destino} ·{' '}
                    {formatarHorario(trecho.voo.dataPartida)}
                  </p>
                ))}
              </div>
            ),
        )}

        <p className="mt-2 text-sm text-slate-500">{reserva.numeroPassageiros} passageiro(s)</p>

        <p className="mt-3 text-lg font-semibold">
          {(precoTotal * reserva.numeroPassageiros).toLocaleString('pt-BR', {
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
