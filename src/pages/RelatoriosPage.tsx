import { useState, useMemo } from 'react';
import { FlaskConical, Trash2, HeartCrack, AlertTriangle, TrendingUp } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';
import { SectionCard, FilterChip } from '@/components/ui-parts';
import { BarChart } from '@/components/BarChart';
import {
  materiais,
  movimentacoes,
  vidrarias,
  consumoData,
  quebrasData,
  diasAteValidade,
  formatDataBR,
} from '@/data/demoData';
import { periodos } from '@/data/demoData';

function withinPeriod(data: string, periodo: string): boolean {
  if (periodo === 'todos') return true;
  const hoje = new Date('2026-09-01');
  const d = new Date(data);
  const diff = (hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  switch (periodo) {
    case 'hoje': return diff < 1;
    case '7d': return diff <= 7;
    case '30d': return diff <= 30;
    case 'mes': return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    default: return true;
  }
}

export function RelatoriosPage() {
  const [periodo, setPeriodo] = useState('30d');

  const movsFiltered = useMemo(
    () => movimentacoes.filter((m) => withinPeriod(m.data, periodo)),
    [periodo],
  );

  const totalDescartes = movsFiltered.filter((m) => m.tipo === 'Descarte').length;
  const totalDescartesQtde = movsFiltered.filter((m) => m.tipo === 'Descarte').reduce((s, m) => s + m.quantidade, 0);
  const totalQuebras = movsFiltered.filter((m) => m.tipo === 'Quebra').length;

  const estoqueCritico = materiais.filter((m) => m.status === 'low');
  const proxVenc = materiais.filter((m) => { const d = diasAteValidade(m.validade); return d >= 0 && d <= 30; });

  // Materiais mais utilizados (by retirada count in period)
  const usoPorMaterial = useMemo(() => {
    const counts: Record<string, number> = {};
    movsFiltered
      .filter((m) => m.tipo === 'Retirada' && m.categoria === 'material')
      .forEach((m) => {
        counts[m.item] = (counts[m.item] || 0) + m.quantidade;
      });
    return Object.entries(counts)
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [movsFiltered]);

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Indicadores de consumo, descartes e quebras" />

      {/* Period filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {periodos.map((p) => (
          <FilterChip key={p.id} active={periodo === p.id} onClick={() => setPeriodo(p.id)}>
            {p.label}
          </FilterChip>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Consumo total" value={`${movsFiltered.filter((m) => m.tipo === 'Retirada' && m.categoria === 'material').reduce((s, m) => s + m.quantidade, 0)} mL`} icon={FlaskConical} tone="info" />
        <StatCard label="Descartes" value={`${totalDescartes} (${totalDescartesQtde} un.)`} icon={Trash2} tone="warning" />
        <StatCard label="Quebras" value={totalQuebras} icon={HeartCrack} tone="danger" />
        <StatCard label="Estoque crítico" value={estoqueCritico.length} icon={AlertTriangle} tone="danger" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Consumo de materiais" action={<span className="text-xs text-ink-400">Últimos 7 dias</span>}>
          <BarChart
            data={consumoData.map((d) => ({ label: d.dia, value: d.valor }))}
            color="#1f7d8c"
            valueSuffix=" mL"
          />
        </SectionCard>
        <SectionCard title="Quebras de vidrarias" action={<span className="text-xs text-ink-400">Últimas 6 semanas</span>}>
          <BarChart
            data={quebrasData.map((d) => ({ label: d.semana, value: d.valor }))}
            color="#dc2626"
          />
        </SectionCard>
      </div>

      {/* Materiais mais utilizados */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Materiais mais utilizados" action={<TrendingUp size={16} className="text-ink-400" />}>
          {usoPorMaterial.length === 0 ? (
            <p className="text-sm text-ink-400">Nenhum dado no período selecionado.</p>
          ) : (
            <div className="space-y-3">
              {usoPorMaterial.map((m, i) => {
                const max = usoPorMaterial[0].total;
                const pct = (m.total / max) * 100;
                return (
                  <div key={m.nome}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-ink-700">
                        <span className="mr-2 text-ink-400">{i + 1}.</span>{m.nome}
                      </span>
                      <span className="font-medium text-ink-600">{m.total} mL</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink-100">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Materiais em estoque crítico">
          {estoqueCritico.length === 0 ? (
            <p className="text-sm text-ink-400">Nenhum material em estoque crítico.</p>
          ) : (
            <ul className="space-y-2.5">
              {estoqueCritico.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{m.nome}</p>
                    <p className="text-xs text-ink-500">{m.quantidade} {m.unidade} · mín. {m.estoqueMinimo} {m.unidade}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">Estoque baixo</span>
                </li>
              ))}
            </ul>
          )}

          {/* Also show near expiry */}
          {proxVenc.length > 0 && (
            <div className="mt-4 border-t border-ink-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Próximos do vencimento</p>
              <ul className="space-y-2">
                {proxVenc.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink-700">{m.nome}</span>
                    <span className="text-xs text-amber-600">Vence em {diasAteValidade(m.validade)} dias</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-ink-400">
        Relatório gerado em {formatDataBR('2026-09-01')} · Período: {periodos.find((p) => p.id === periodo)?.label}
      </div>
    </div>
  );
}
