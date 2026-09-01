import { useState, useMemo } from 'react';
import { Plus, ChevronRight, ArrowLeft, LogIn, LogOut, Trash2, Search, ArrowUpDown, Package } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';
import { Tabs, Select, InfoRow, SectionCard } from '@/components/ui-parts';
import { useRouter } from '@/router/Router';
import {
  materiais,
  movimentacoes,
  statusBadgeClass,
  statusLabel,
  statusDotColor,
  formatDataBR,
  diasAteValidade,
  tipoMovimentacaoColor,
  type Material,
  type MaterialStatus,
} from '@/data/demoData';

type SortField = 'nome' | 'codigo' | 'categoria' | 'quantidade' | 'validade';
type SortDir = 'asc' | 'desc';

export function MateriaisPage({ search: externalSearch }: { search: string }) {
  const { navigate } = useRouter();
  const [localSearch, setLocalSearch] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const search = (externalSearch || localSearch).trim().toLowerCase();

  const categorias = useMemo(() => [...new Set(materiais.map((m) => m.categoria))], []);
  const statusOptions: { value: MaterialStatus; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'attention', label: 'Atenção' },
    { value: 'low', label: 'Estoque baixo' },
    { value: 'expired', label: 'Vencido' },
  ];

  const filtered = useMemo(() => {
    let list = materiais.filter((m) => {
      const matchSearch = !search ||
        m.nome.toLowerCase().includes(search) ||
        m.codigo.toLowerCase().includes(search) ||
        m.lote.toLowerCase().includes(search) ||
        m.categoria.toLowerCase().includes(search);
      const matchCat = !categoriaFiltro || m.categoria === categoriaFiltro;
      const matchStatus = !statusFiltro || m.status === statusFiltro;
      return matchSearch && matchCat && matchStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'nome': cmp = a.nome.localeCompare(b.nome); break;
        case 'codigo': cmp = a.codigo.localeCompare(b.codigo); break;
        case 'categoria': cmp = a.categoria.localeCompare(b.categoria); break;
        case 'quantidade': cmp = a.quantidade - b.quantidade; break;
        case 'validade': cmp = a.validade.localeCompare(b.validade); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [search, categoriaFiltro, statusFiltro, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const totalMateriais = materiais.length;
  const estoqueBaixo = materiais.filter((m) => m.status === 'low').length;
  const proxVenc = materiais.filter((m) => { const d = diasAteValidade(m.validade); return d >= 0 && d <= 30; }).length;

  const SortHeader = ({ field, label, className = '' }: { field: SortField; label: string; className?: string }) => (
    <th className={`px-4 py-3 ${className}`}>
      <button
        onClick={() => toggleSort(field)}
        className="inline-flex items-center gap-1 hover:text-ink-700"
      >
        {label}
        <ArrowUpDown size={12} className={sortField === field ? 'text-brand-600' : 'text-ink-300'} />
      </button>
    </th>
  );

  return (
    <div>
      <PageHeader
        title="Materiais"
        subtitle="Reagentes e insumos do laboratório"
        action={<button className="btn-primary"><Plus size={18} /> Novo material</button>}
      />

      {/* Mini stats */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Total" value={totalMateriais} icon={Package} tone="info" />
        <StatCard label="Estoque baixo" value={estoqueBaixo} icon={Search} tone="danger" />
        <StatCard label="Próx. vencimento" value={proxVenc} icon={Search} tone="warning" />
      </div>

      {/* Filters bar */}
      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar por nome, código, lote..."
            className="input pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select
            value={categoriaFiltro}
            onChange={setCategoriaFiltro}
            placeholder="Categoria"
            options={categorias.map((c) => ({ value: c, label: c }))}
            className="sm:w-40"
          />
          <Select
            value={statusFiltro}
            onChange={setStatusFiltro}
            placeholder="Status"
            options={statusOptions}
            className="sm:w-40"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex items-center justify-center px-6 py-12 text-sm text-ink-400">
          Nenhum material encontrado.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                  <SortHeader field="nome" label="Nome" />
                  <SortHeader field="codigo" label="Código" />
                  <SortHeader field="categoria" label="Categoria" />
                  <SortHeader field="quantidade" label="Qtde" />
                  <th className="px-4 py-3">Lote</th>
                  <SortHeader field="validade" label="Validade" />
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => navigate(`/materiais/${m.id}`)}
                    className="cursor-pointer hover:bg-ink-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-ink-900">{m.nome}</td>
                    <td className="px-4 py-3 text-ink-600">{m.codigo}</td>
                    <td className="px-4 py-3 text-ink-600">{m.categoria}</td>
                    <td className="px-4 py-3 text-ink-600">{m.quantidade} {m.unidade}</td>
                    <td className="px-4 py-3 text-ink-600">{m.lote}</td>
                    <td className="px-4 py-3 text-ink-600">{formatDataBR(m.validade)}</td>
                    <td className="px-4 py-3">
                      <span className={statusBadgeClass(m.status)}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor[m.status]}`} />
                        {statusLabel(m.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight size={16} className="text-ink-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/materiais/${m.id}`)}
                className="card w-full p-4 text-left active:bg-ink-50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink-900">{m.nome}</p>
                  <span className={statusBadgeClass(m.status)}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor[m.status]}`} />
                    {statusLabel(m.status)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                  <span>{m.codigo}</span>
                  <span>{m.quantidade} {m.unidade}</span>
                  <span>Lote {m.lote}</span>
                  <span>Val. {formatDataBR(m.validade)}</span>
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

type DetailTab = 'overview' | 'estoque' | 'movimentacoes' | 'descarte';

export function MaterialDetailPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const material = materiais.find((m) => m.id === id);

  if (!material) {
    return (
      <div>
        <button onClick={() => navigate('/materiais')} className="btn-secondary mb-4">
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="card px-6 py-12 text-center text-sm text-ink-400">Material não encontrado.</div>
      </div>
    );
  }

  return <MaterialDetailView material={material} />;
}

function MaterialDetailView({ material }: { material: Material }) {
  const { navigate } = useRouter();
  const [tab, setTab] = useState<DetailTab>('overview');
  const dias = diasAteValidade(material.validade);
  const estoquePct = Math.min((material.quantidade / (material.estoqueMinimo * 3)) * 100, 100);

  const movsItem = movimentacoes.filter((m) => m.itemId === material.id);
  const entradas = movsItem.filter((m) => m.tipo === 'Entrada').reduce((s, m) => s + m.quantidade, 0);
  const retiradas = movsItem.filter((m) => m.tipo === 'Retirada').reduce((s, m) => s + m.quantidade, 0);
  const descartes = movsItem.filter((m) => m.tipo === 'Descarte').reduce((s, m) => s + m.quantidade, 0);

  const tabs = [
    { id: 'overview' as const, label: 'Visão geral' },
    { id: 'estoque' as const, label: 'Estoque' },
    { id: 'movimentacoes' as const, label: 'Movimentações', count: movsItem.length },
    { id: 'descarte' as const, label: 'Descarte', count: movsItem.filter((m) => m.tipo === 'Descarte').length },
  ];

  return (
    <div>
      <button onClick={() => navigate('/materiais')} className="btn-secondary mb-4">
        <ArrowLeft size={18} /> Voltar
      </button>

      {/* Header card */}
      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-ink-900">{material.nome}</h1>
              <p className="mt-0.5 text-sm text-ink-500">{material.codigo} · {material.categoria}</p>
            </div>
            <span className={statusBadgeClass(material.status)}>
              <span className={`h-2 w-2 rounded-full ${statusDotColor[material.status]}`} />
              {statusLabel(material.status)}
            </span>
          </div>
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-ink-500">
              <span>Estoque atual</span>
              <span>{material.quantidade} / {material.estoqueMinimo} {material.unidade} (mín.)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-ink-100">
              <div
                className={`h-2.5 rounded-full transition-all ${material.status === 'low' ? 'bg-orange-500' : material.status === 'expired' ? 'bg-red-500' : material.status === 'attention' ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${estoquePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 border-b border-ink-100 px-6 py-4 sm:flex-row">
          <button className="btn-primary sm:flex-1"><LogIn size={18} /> Registrar entrada</button>
          <button className="btn-secondary sm:flex-1"><LogOut size={18} /> Registrar retirada</button>
          <button className="btn-danger sm:flex-1"><Trash2 size={18} /> Registrar descarte</button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Tab content */}
        <div className="px-6 py-5">
          {tab === 'overview' && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <InfoRow label="Nome" value={material.nome} />
              <InfoRow label="Código" value={material.codigo} />
              <InfoRow label="Categoria" value={material.categoria} />
              <InfoRow label="Lote" value={material.lote} />
              <InfoRow label="Fornecedor" value={material.fornecedor} />
              <InfoRow label="Quantidade atual" value={`${material.quantidade} ${material.unidade}`} />
              <InfoRow label="Estoque mínimo" value={`${material.estoqueMinimo} ${material.unidade}`} />
              <InfoRow label="Validade" value={`${formatDataBR(material.validade)} (${dias >= 0 ? `em ${dias} dias` : `vencido há ${Math.abs(dias)} dias`})`} />
              <InfoRow label="Local de armazenamento" value={material.localArmazenamento} />
              <InfoRow label="Temperatura recomendada" value={material.temperaturaRecomendada} />
              <InfoRow label="Status" value={statusLabel(material.status)} />
            </div>
          )}

          {tab === 'estoque' && (
            <div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-emerald-700">{entradas}</p>
                  <p className="mt-0.5 text-xs text-ink-500">Entradas (hist.)</p>
                </div>
                <div className="rounded-lg bg-brand-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-brand-700">{retiradas}</p>
                  <p className="mt-0.5 text-xs text-ink-500">Retiradas (hist.)</p>
                </div>
                <div className="rounded-lg bg-ink-100 p-4 text-center">
                  <p className="text-2xl font-semibold text-ink-700">{material.quantidade}</p>
                  <p className="mt-0.5 text-xs text-ink-500">Saldo atual ({material.unidade})</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <InfoRow label="Estoque mínimo" value={`${material.estoqueMinimo} ${material.unidade}`} />
                <InfoRow label="Local de armazenamento" value={material.localArmazenamento} />
                <InfoRow label="Temperatura recomendada" value={material.temperaturaRecomendada} />
              </div>
            </div>
          )}

          {tab === 'movimentacoes' && (
            <div>
              {movsItem.length === 0 ? (
                <p className="text-sm text-ink-400">Nenhuma movimentação registrada para este material.</p>
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

          {tab === 'descarte' && (
            <div>
              <div className="mb-4 rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  Total descartado: <span className="font-semibold">{descartes} {material.unidade}</span>
                </p>
              </div>
              {movsItem.filter((m) => m.tipo === 'Descarte').length === 0 ? (
                <p className="text-sm text-ink-400">Nenhum descarte registrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                        <th className="pb-2 pr-4">Data</th>
                        <th className="pb-2 pr-4">Horário</th>
                        <th className="pb-2 pr-4 text-right">Qtde</th>
                        <th className="pb-2">Responsável</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {movsItem.filter((m) => m.tipo === 'Descarte').map((m) => (
                        <tr key={m.id}>
                          <td className="py-2.5 pr-4 text-ink-600">{formatDataBR(m.data)}</td>
                          <td className="py-2.5 pr-4 text-ink-600">{m.horario}</td>
                          <td className="py-2.5 pr-4 text-right font-medium text-amber-700">{m.quantidade} {material.unidade}</td>
                          <td className="py-2.5 text-ink-600">{m.responsavel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-5">
                <button className="btn-danger"><Trash2 size={18} /> Registrar novo descarte</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
