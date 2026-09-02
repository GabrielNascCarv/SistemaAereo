import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario';

const classesPorVariante: Record<Variante, string> = {
  primario: 'bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-300',
  secundario: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100',
};

export function Botao({
  variante = 'primario',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${classesPorVariante[variante]} ${className}`}
      {...props}
    />
  );
}
