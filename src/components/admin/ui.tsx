import type { ReactNode } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-2.5 text-white outline-none transition focus:border-sky-500/40 placeholder-slate-500';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls + ' ' + (props.className || '')} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={inputCls + ' ' + (props.className || '')} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputCls + ' ' + (props.className || '')} />;
}

export function Btn({ children, variant = 'primary', ...props }: { children: ReactNode; variant?: 'primary' | 'ghost' | 'danger' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: 'btn-brand text-white',
    ghost: 'border border-white/8 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]',
    danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25',
  };
  return <button {...props} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${styles[variant]} ${props.className || ''}`}>{children}</button>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/8 bg-white/[0.025] p-6 ${className}`}>{children}</div>;
}

export function PageHead({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
