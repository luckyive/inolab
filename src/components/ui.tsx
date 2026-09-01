import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-ink-900 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, tone = 'default' }: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const tones: Record<string, string> = {
    default: 'bg-ink-100 text-ink-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-brand-50 text-brand-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );
}
