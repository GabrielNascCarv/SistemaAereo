import { createContext, useContext, useState, type ReactNode } from 'react';
import type { OfertaVoo, Voo, Reserva } from '../types/api';

interface FluxoReservaState {
  oferta: OfertaVoo | null;
  voo: Voo | null;
  reserva: Reserva | null;
  setOferta: (oferta: OfertaVoo) => void;
  setVoo: (voo: Voo) => void;
  setReserva: (reserva: Reserva) => void;
  reiniciar: () => void;
}

const FluxoReservaContext = createContext<FluxoReservaState | null>(null);

export function FluxoReservaProvider({ children }: { children: ReactNode }) {
  const [oferta, setOferta] = useState<OfertaVoo | null>(null);
  const [voo, setVoo] = useState<Voo | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const reiniciar = () => {
    setOferta(null);
    setVoo(null);
    setReserva(null);
  };

  return (
    <FluxoReservaContext.Provider
      value={{ oferta, voo, reserva, setOferta, setVoo, setReserva, reiniciar }}
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
