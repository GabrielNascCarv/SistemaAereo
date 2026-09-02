import { createContext, useContext, useState, type ReactNode } from 'react';
import type { OfertaVoo, TrechoReserva, Reserva } from '../types/api';

interface FluxoReservaState {
  oferta: OfertaVoo | null;
  trechos: TrechoReserva[] | null;
  reserva: Reserva | null;
  setOferta: (oferta: OfertaVoo) => void;
  setTrechos: (trechos: TrechoReserva[]) => void;
  setReserva: (reserva: Reserva) => void;
  reiniciar: () => void;
}

const FluxoReservaContext = createContext<FluxoReservaState | null>(null);

export function FluxoReservaProvider({ children }: { children: ReactNode }) {
  const [oferta, setOferta] = useState<OfertaVoo | null>(null);
  const [trechos, setTrechos] = useState<TrechoReserva[] | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const reiniciar = () => {
    setOferta(null);
    setTrechos(null);
    setReserva(null);
  };

  return (
    <FluxoReservaContext.Provider
      value={{ oferta, trechos, reserva, setOferta, setTrechos, setReserva, reiniciar }}
    >
      {children}
    </FluxoReservaContext.Provider>
  );
}

export function useFluxoReserva(): FluxoReservaState {
  const context = useContext(FluxoReservaContext);
  if (!context) {
    throw new Error('useFluxoReserva deve ser usado dentro de FluxoReservaProvider');
  }
  return context;
}
