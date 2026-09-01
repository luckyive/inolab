import { useState } from 'react';
import { AlertTriangle, CalendarClock, TestTube, PackageX, Check, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { Tabs } from '@/components/ui-parts';
import { useRouter } from '@/router/Router';
import {
  materiais,
  vidrarias,
  diasAteValidade,
  statusBadgeClass,
  statusLabel,
  formatDataBR,
} from '@/data/demoData';

type Tab = 'estoque' | 'validade' | 'vidrarias';
type Prioridade = 'alta' | 'media' | 'baixa';

type AlertItem = {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  badge?: string;
  badgeClass?: string;
};

function buildEstoqueAlerts(): AlertItem[] {
  return materiais
    .filter((m) => m.status === 'low')
    .map((m) => ({
      id: m.id,
      titulo: m.nome,
      descricao: `Estoque atual: ${m.quantidade} ${m.unidade} · Mínimo: ${m.estoqueMinimo} ${m.unidade}`,
      prioridade: 'alta' as Prioridade,
      badge: statusLabel(m.status),
      badgeClass: statusBadgeClass(m.status),
    }));
}

function buildValidadeAlerts(): AlertItem[] {
  return materiais
    .filter((m) => {
      const d = diasAteValidade(m.validade);
      return d >= 0 && d <= 30;
    })
    .map((m) => {
      const d = diasAteValidade(m.validade);
      return {
        id: m.id,
        titulo: m.nome,
        descricao: `Validade: ${formatDataBR(m.validade)} · Vence em ${d} dias`,
        prioridade: (d <= 7 ? 'alta' : 'media') as Prioridade,
        badge: statusLabel(m.status),
        badgeClass: statusBadgeClass(m.status),
      };
    });
}

function buildVidrariasAlerts(): AlertItem[] {
  return vidrarias
    .filter((v) => v.disponiveis <= 10 || v.quebradas > 0)
    .map((v) => ({
      id: v.id,
      titulo: `${v.tipo} ${v.capacidade}`,
      descricao: v.disponiveis <= 10
        ? `Disponíveis: ${v.disponiveis} de ${v.quantidadeTotal} — quantidade baixa`
        : `Quebradas: ${v.quebradas} de ${v.quantidadeTotal}`,
      prioridade: (v.disponiveis <= 5 ? 'alta' : 'baixa') as Prioridade,
      badge: v.disponiveis <= 10 ? 'Atenção' : 'Quebra',
      badgeClass: v.disponiveis <= 10 ? 'badge-attention' : 'badge-expired',
    }));
}

const prioridadeConfig: Record<Prioridade, { label: string; bar: string; chip: string; dot: string }> = {
  alta: { label: 'Alta', bar: 'bg-red-500', chip: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  media: { label: 'Média', bar: 'bg-amber-400', chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  baixa: { label: 'Baixa', bar: 'bg-sky-400', chip: 'bg-sky-50 text-sky-700', dot: 'bg-sky-400' },
};

export function AlertasPage() {
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('estoque');
  const [resolvidos, setResolvidos] = useState<Set<string>>(new Set());

  const estoqueAlerts = buildEstoqueAlerts();
  const validadeAlerts = buildValidadeAlerts();
  const vidrariasAlerts = buildVidrariasAlerts();

  const toggleResolvido = (id: string) => {
    setResolvidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs: { id: Tab; label: string; icon: typeof AlertTriangle; count: number }[] = [
    { id: 'estoque', label: 'Estoque', icon: PackageX, count: estoqueAlerts.filter((a) => !resolvidos.has(a.id)).length },
    { id: 'validade', label: 'Validade', icon: CalendarClock, count: validadeAlerts.filter((a) => !resolvidos.has(a.id)).length },
    { id: 'vidrarias', label: 'Vidrarias', icon: TestTube, count: vidrariasAlerts.filter((a) => !resolvidos.has(a.id)).length },
  ];

  const currentItems = tab === 'estoque' ? estoqueAlerts : tab === 'validade' ? validadeAlerts : vidrariasAlerts;
  const onAction = tab === 'vidrarias'
    ? (id: string) => navigate(`/vidrarias/${id}`)
    : (id: string) => navigate(`/materiais/${id}`);

  // Sort by priority
  const priorityOrder: Record<Prioridade, number> = { alta: 0, media: 1, baixa: 2 };
  const sorted = [...currentItems].sort((a, b) => priorityOrder[a.prioridade] - priorityOrder[b.prioridade]);

  return (
    <div>
      <PageHeader title="Alertas" subtitle="Itens que precisam de atenção, organizados por prioridade" />

      <div className="mb-5">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {/* Priority legend */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs text-ink-500">
        {(Object.keys(prioridadeConfig) as Prioridade[]).map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${prioridadeConfig[p].dot}`} />
            {prioridadeConfig[p].label}
          </span>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={22} className="text-emerald-500" />
          </div>
          <p className="text-sm text-ink-400">Nenhum alerta nesta categoria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => {
            const isResolvido = resolvidos.has(item.id);
            return (
              <div
                key={item.id}
                className={`card flex items-center gap-4 p-4 transition-opacity ${isResolvido ? 'opacity-50' : ''}`}
              >
                <div className={`h-10 w-1.5 shrink-0 rounded-full ${prioridadeConfig[item.prioridade].bar}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-medium text-ink-900 ${isResolvido ? 'line-through' : ''}`}>{item.titulo}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${prioridadeConfig[item.prioridade].chip}`}>
                      {prioridadeConfig[item.prioridade].label}
                    </span>
                    {item.badge && item.badgeClass && (
                      <span className={item.badgeClass}>{item.badge}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">{item.descricao}</p>
                </div>
                <button
                  onClick={() => toggleResolvido(item.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isResolvido
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                  }`}
                >
                  <Check size={14} className="mr-1 inline" />
                  {isResolvido ? 'Resolvido' : 'Marcar resolvido'}
                </button>
                <button onClick={() => onAction(item.id)} className="btn-secondary shrink-0 text-sm">
                  Ver detalhes
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
