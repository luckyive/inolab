import type { ReactNode } from 'react';

export function Tabs<T extends string>({ tabs, active, onChange }: {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-ink-100 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            active === t.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          {t.label}
          {t.count !== undefined && t.count > 0 && (
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${active === t.id ? 'bg-brand-100 text-brand-700' : 'bg-ink-200 text-ink-600'}`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Select({ value, onChange, options, placeholder, className = '' }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input cursor-pointer ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function FilterChip({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
      }`}
    >
      {children}
    </button>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-ink-100 pb-3 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 text-sm text-ink-800">{value}</p>
    </div>
  );
}

export function SectionCard({ title, action, children, className = '' }: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
