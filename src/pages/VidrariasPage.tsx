import { useState } from 'react';
import { Plus, ChevronRight, ArrowLeft, LogOut, Undo2, HeartCrack, Search } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';
import { Select, InfoRow, SectionCard, Tabs } from '@/components/ui-parts';
import { useRouter } from '@/router/Router';
import {
  vidrarias,
  movimentacoes,
  formatDataBR,
  tipoMovimentacaoColor,
  type Vidraria,
} from '@/data/demoData';

type SortField = 'codigo' | 'tipo' | 'capacidade' | 'disponiveis' | 'quebradas';
type SortDir = 'asc' | 'desc';

export function VidrariasPage({ search: externalSearch }: { search: string }) {
  const { navigate } = useRouter();
  const [localSearch, setLocalSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [sortField, setSortField] = useState<SortField>('codigo');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const search = (externalSearch || localSearch).trim().toLowerCase();
  const tipos = [...new Set(vidrarias.map((v) => v.tipo))];

  const filtered = [...vidrarias]
    .filter((v) => {
      const matchSearch = !search ||
        v.codigo.toLowerCase().includes(search) ||
        v.tipo.toLowerCase().includes(search) ||
        v.capacidade.toLowerCase().includes(search);
      const matchTipo = !tipoFiltro || v.tipo === tipoFiltro;
      return matchSearch && matchTipo;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'codigo': cmp = a.codigo.localeCompare(b.codigo); break;
        case 'tipo': cmp = a.tipo.localeCompare(b.tipo); break;
        case 'capacidade': cmp = a.capacidade.localeCompare(b.capacidade); break;
        case 'disponiveis': cmp = a.disponiveis - b.disponiveis; break;
        case 'quebradas': cmp = a.quebradas - b.quebradas; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const totalDisponiveis = vidrarias.reduce((s, v) => s + v.disponiveis, 0);
  const totalEmUso = vidrarias.reduce((s, v) => s + v.emUso, 0);
  const totalQuebradas = vidrarias.reduce((s, v) => s + v.quebradas, 0);

  const SortHeader = ({ field, label, className = '' }: { field: SortField; label: string; className?: string }) => (
    <th className={`px-4 py-3 ${className}`}>
      <button onClick={() => toggleSort(field)} className="inline-flex items-center gap-1 hover:text-ink-700">
        {label}
      </button>
    </th>
  );

  return (
    <div>
      <PageHeader
        title="Vidrarias"
        subtitle="Controle de vidrarias de laboratório"
        action={<button className="btn-primary"><Plus size={18} /> Nova vidraria</button>}
      />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Disponíveis" value={totalDisponiveis} icon={Search} tone="success" />
        <StatCard label="Em uso" value={totalEmUso} icon={Search} tone="info" />
        <StatCard label="Quebradas" value={totalQuebradas} icon={HeartCrack} tone="danger" />
      </div>

      {/* Filters */}
      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar por código, tipo, capacidade..."
            className="input pl-9"
          />
        </div>
        <Select
          value={tipoFiltro}
          onChange={setTipoFiltro}
          placeholder="Tipo"
          options={tipos.map((t) => ({ value: t, label: t }))}
          className="sm:w-40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card flex items-center justify-center px-6 py-12 text-sm text-ink-400">
          Nenhuma vidraria encontrada.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                  <SortHeader field="codigo" label="Código" />
                  <SortHeader field="tipo" label="Tipo" />
                  <SortHeader field="capacidade" label="Capacidade" />
                  <th className="px-4 py-3 text-center">Total</th>
                  <SortHeader field="disponiveis" label="Disp." className="text-center" />
                  <th className="px-4 py-3 text-center">Em uso</th>
                  <SortHeader field="quebradas" label="Quebr." className="text-center" />
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((v) => (
                  <tr key={v.id} onClick={() => navigate(`/vidrarias/${v.id}`)} className="cursor-pointer hover:bg-ink-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink-900">{v.codigo}</td>
                    <td className="px-4 py-3 text-ink-600">{v.tipo}</td>
                    <td className="px-4 py-3 text-ink-600">{v.capacidade}</td>
                    <td className="px-4 py-3 text-center text-ink-600">{v.quantidadeTotal}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={v.disponiveis <= 10 ? 'font-semibold text-orange-600' : 'text-ink-600'}>{v.disponiveis}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-ink-600">{v.emUso}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={v.quebradas > 0 ? 'font-semibold text-red-600' : 'text-ink-600'}>{v.quebradas}</span>
                    </td>
                    <td className="px-4 py-3 text-right"><ChevronRight size={16} className="text-ink-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((v) => (
              <button key={v.id} onClick={() => navigate(`/vidrarias/${v.id}`)} className="card w-full p-4 text-left active:bg-ink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink-900">{v.tipo} {v.capacidade}</p>
                    <p className="text-xs text-ink-500">{v.codigo}</p>
                  </div>
                  <ChevronRight size={18} className="text-ink-400" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-ink-50 py-2"><p className="text-ink-400">Total</p><p className="font-semibold text-ink-700">{v.quantidadeTotal}</p></div>
                  <div className="rounded-lg bg-emerald-50 py-2"><p className="text-emerald-600">Disp.</p><p className="font-semibold text-emerald-700">{v.disponiveis}</p></div>
                  <div className="rounded-lg bg-brand-50 py-2"><p className="text-brand-600">Uso</p><p className="font-semibold text-brand-700">{v.emUso}</p></div>
                  <div className="rounded-lg bg-red-50 py-2"><p className="text-red-600">Quebr.</p><p className="font-semibold text-red-700">{v.quebradas}</p></div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== Detail Page ===================== */

type DetailTab = 'overview' | 'movimentacoes';

export function VidrariaDetailPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const v = vidrarias.find((x) => x.id === id);

  if (!v) {
    return (
      <div>
        <button onClick={() => navigate('/vidrarias')} className="btn-secondary mb-4"><ArrowLeft size={18} /> Voltar</button>
        <div className="card px-6 py-12 text-center text-sm text-ink-400">Vidraria não encontrada.</div>
      </div>
    );
  }
  return <VidrariaDetailView vidraria={v} />;
}

function VidrariaDetailView({ vidraria }: { vidraria: Vidraria }) {
  const { navigate } = useRouter();
  const [tab, setTab] = useState<DetailTab>('overview');

  const nomeCompleto = `${vidraria.tipo} ${vidraria.capacidade}`;
  const movsItem = movimentacoes.filter((m) => m.itemId === vidraria.id);

  const stats = [
    { label: 'Disponíveis', value: vidraria.disponiveis, bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { label: 'Em uso', value: vidraria.emUso, bg: 'bg-brand-50', text: 'text-brand-700' },
    { label: 'Quebradas', value: vidraria.quebradas, bg: 'bg-red-50', text: 'text-red-700' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Visão geral' },
    { id: 'movimentacoes' as const, label: 'Movimentações', count: movsItem.length },
  ];

  return (
    <div>
      <button onClick={() => navigate('/vidrarias')} className="btn-secondary mb-4"><ArrowLeft size={18} /> Voltar</button>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="border-b border-ink-100 px-6 py-5">
          <h1 className="text-xl font-semibold text-ink-900">{nomeCompleto}</h1>
          <p className="mt-0.5 text-sm text-ink-500">{vidraria.codigo}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className={`rounded-lg ${s.bg} px-4 py-3 text-center`}>
                <p className={`text-2xl font-semibold ${s.text}`}>{s.value}</p>
                <p className="mt-0.5 text-xs text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-b border-ink-100 px-6 py-4 sm:flex-row">
          <button className="btn-primary sm:flex-1"><LogOut size={18} /> Retirar</button>
          <button className="btn-secondary sm:flex-1"><Undo2 size={18} /> Devolver</button>
          <button className="btn-danger sm:flex-1"><HeartCrack size={18} /> Registrar quebra</button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Tab content */}
        <div className="px-6 py-5">
          {tab === 'overview' && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <InfoRow label="Código" value={vidraria.codigo} />
              <InfoRow label="Tipo" value={vidraria.tipo} />
              <InfoRow label="Capacidade" value={vidraria.capacidade} />
              <InfoRow label="Quantidade total" value={String(vidraria.quantidadeTotal)} />
              <InfoRow label="Disponíveis" value={String(vidraria.disponiveis)} />
              <InfoRow label="Em uso" value={String(vidraria.emUso)} />
              <InfoRow label="Quebradas / danificadas" value={String(vidraria.quebradas)} />
            </div>
          )}

          {tab === 'movimentacoes' && (
            <div>
              {movsItem.length === 0 ? (
                <p className="text-sm text-ink-400">Nenhuma movimentação registrada para esta vidraria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                        <th className="pb-2 pr-4">Data</th>
                        <th className="pb-2 pr-4">Horário</th>
                        <th className="pb-2 pr-4">Tipo</th>
                        <th className="pb-2 pr-4 text-right">Qtde</th>
                        <th className="pb-2">Responsável</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {movsItem.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2.5 pr-4 text-ink-600">{formatDataBR(m.data)}</td>
                          <td className="py-2.5 pr-4 text-ink-600">{m.horario}</td>
                          <td className="py-2.5 pr-4">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tipoMovimentacaoColor[m.tipo]}`}>{m.tipo}</span>
                          </td>
                          <td className="py-2.5 pr-4 text-right font-medium text-ink-700">{m.quantidade}</td>
                          <td className="py-2.5 text-ink-600">{m.responsavel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
