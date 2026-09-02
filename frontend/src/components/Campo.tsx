import type { InputHTMLAttributes } from 'react';

export function Campo({
  label,
  erro,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; erro?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        className={`rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 ${
          erro ? 'border-red-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {erro && <span className="text-xs text-red-600">{erro}</span>}
    </label>
  );
}
