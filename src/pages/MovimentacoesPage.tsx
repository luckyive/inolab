import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui';
import { Select, FilterChip } from '@/components/ui-parts';
import {
  movimentacoes,
  formatDataBR,
  tipoMovimentacaoColor,
  periodos,
  type MovimentacaoTipo,
} from '@/data/demoData';

const tipos: (MovimentacaoTipo | 'Todos')[] = ['Todos', 'Entrada', 'Retirada', 'Devolução', 'Descarte', 'Quebra'];
const todosItens = [...new Set(movimentacoes.map((m) => m.item))].sort();
const todosResponsaveis = [...new Set(movimentacoes.map((m) => m.responsavel))].sort();

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

export function MovimentacoesPage() {
  const [periodo, setPeriodo] = useState('todos');
  const [tipo, setTipo] = useState<MovimentacaoTipo | 'Todos'>('Todos');
  const [item, setItem] = useState('');
  const [resp, setResp] = useState('');

  const filtered = useMemo(() => {
    return movimentacoes.filter((m) => {
      const matchPeriod = withinPeriod(m.data, periodo);
      const matchTipo = tipo === 'Todos' || m.tipo === tipo;
      const matchItem = !item || m.item === item;
      const matchResp = !resp || m.responsavel === resp;
      return matchPeriod && matchTipo && matchItem && matchResp;
    });
  }, [periodo, tipo, item, resp]);

  return (
    <div>
      <PageHeader
        title="Movimentações"
        subtitle="Histórico de entradas, retiradas, devoluções, descartes e quebras"
      />

      {/* Filters */}
      <div className="card mb-4 space-y-3 p-4">
        {/* Period chips */}
        <div className="flex flex-wrap gap-2">
          {periodos.map((p) => (
            <FilterChip key={p.id} active={periodo === p.id} onClick={() => setPeriodo(p.id)}>
              {p.label}
            </FilterChip>
          ))}
        </div>
        {/* Dropdown filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="label">Tipo</label>
            <Select
              value={tipo}
              onChange={(v) => setTipo(v as MovimentacaoTipo | 'Todos')}
              options={tipos.filter((t) => t !== 'Todos').map((t) => ({ value: t, label: t }))}
            />
          </div>
          <div>
            <label className="label">Material / Item</label>
            <Select
              value={item}
              onChange={setItem}
              placeholder="Todos os itens"
              options={todosItens.map((i) => ({ value: i, label: i }))}
            />
          </div>
          <div>
            <label className="label">Responsável</label>
            <Select
              value={resp}
              onChange={setResp}
              placeholder="Todos"
              options={todosResponsaveis.map((r) => ({ value: r, label: r }))}
            />
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-3 text-sm text-ink-500">
        {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
      </p>

      {filtered.length === 0 ? (
        <div className="card flex items-center justify-center px-6 py-12 text-sm text-ink-400">
          Nenhuma movimentação encontrada com os filtros selecionados.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Horário</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3 text-right">Quantidade</th>
                  <th className="px-4 py-3">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-4 py-3 text-ink-600">{formatDataBR(m.data)}</td>
                    <td className="px-4 py-3 text-ink-600">{m.horario}</td>
                    <td className="px-4 py-3 font-medium text-ink-900">{m.item}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tipoMovimentacaoColor[m.tipo]}`}>{m.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-ink-700">{m.quantidade}</td>
                    <td className="px-4 py-3 text-ink-600">{m.responsavel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((m) => (
              <div key={m.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink-900">{m.item}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tipoMovimentacaoColor[m.tipo]}`}>{m.tipo}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                  <span>{formatDataBR(m.data)} · {m.horario}</span>
                  <span>Qtde: {m.quantidade}</span>
                  <span>Resp.: {m.responsavel}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
