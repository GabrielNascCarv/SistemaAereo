import { useNavigate } from 'react-router-dom';
import { useFluxoReserva } from '../context/fluxo-reserva.context';
import { Botao } from '../components/Botao';

export function PagamentoPage() {
  const navigate = useNavigate();
  const { reiniciar } = useFluxoReserva();

  function voltarAoInicio() {
    reiniciar();
    navigate('/');
  }

  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-5xl" aria-hidden>
        🚧
      </span>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">O projeto termina aqui</h1>
      <p className="mt-3 max-w-md text-sm text-slate-600">
        Este é um projeto de portfólio focado em back-end (NestJS + Prisma + integração com API
        externa) e front-end integrado. Implementar um gateway de pagamento real (Stripe, Mercado
        Pago…) fica fora do escopo — a reserva que você acabou de fazer existe de verdade no banco
        de dados, só não vira uma cobrança de fato.
      </p>

      <Botao onClick={voltarAoInicio} className="mt-8">
        Voltar ao início
      </Botao>
    </div>
  );
}
