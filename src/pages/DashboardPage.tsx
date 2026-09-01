import {
  FlaskConical,
  AlertTriangle,
  CalendarClock,
  TestTube,
  HeartCrack,
  Trash2,
  ArrowRight,
  LogIn,
  LogOut,
  ArrowDownToLine,
} from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';
import { SectionCard } from '@/components/ui-parts';
import { BarChart } from '@/components/BarChart';
import { useRouter } from '@/router/Router';
import {
  materiais,
  vidrarias,
  movimentacoes,
  consumoData,
  quebrasData,
  diasAteValidade,
  formatDataBR,
  tipoMovimentacaoColor,
} from '@/data/demoData';

export function DashboardPage() {
  const { navigate } = useRouter();

  const totalMateriais = materiais.length;
  const estoqueCritico = materiais.filter((m) => m.status === 'low').length;
  const proximosVencimento = materiais.filter((m) => {
    const d = diasAteValidade(m.validade);
    return d >= 0 && d <= 30;
  }).length;
  const descartesMes = movimentacoes.filter((m) => m.tipo === 'Descarte').length;
  const vidrariasDisponiveis = vidrarias.reduce((s, v) => s + v.disponiveis, 0);
  const quebrasMes = movimentacoes.filter((m) => m.tipo === 'Quebra').length;

  const acoes: { texto: string; cor: 'red' | 'amber' }[] = [];
  materiais.forEach((m) => {
    if (m.status === 'low') acoes.push({ texto: `${m.nome} — estoque abaixo do mínimo`, cor: 'red' });
  });
  materiais.forEach((m) => {
    const d = diasAteValidade(m.validade);
    if (d >= 0 && d <= 30) acoes.push({ texto: `${m.nome} — vence em ${d} dias`, cor: 'amber' });
  });
  vidrarias.forEach((v) => {
    if (v.disponiveis <= 10) acoes.push({ texto: `${v.tipo} ${v.capacidade} — quantidade disponível baixa`, cor: 'amber' });
  });

  const movimentacoesRecentes = movimentacoes.slice(0, 6);

  const quickActions = [
    { label: 'Registrar entrada', icon: LogIn, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/materiais' },
    { label: 'Registrar retirada', icon: LogOut, color: 'text-brand-600', bg: 'bg-brand-50', path: '/materiais' },
    { label: 'Registrar descarte', icon: Trash2, color: 'text-amber-600', bg: 'bg-amber-50', path: '/materiais' },
    { label: 'Registrar quebra', icon: HeartCrack, color: 'text-red-600', bg: 'bg-red-50', path: '/vidrarias' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral do laboratório" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total de materiais" value={totalMateriais} icon={FlaskConical} tone="info" />
        <StatCard label="Estoque crítico" value={estoqueCritico} icon={AlertTriangle} tone="danger" />
        <StatCard label="Próx. vencimento" value={proximosVencimento} icon={CalendarClock} tone="warning" />
        <StatCard label="Descartes no mês" value={descartesMes} icon={Trash2} tone="warning" />
        <StatCard label="Vidrarias disp." value={vidrariasDisponiveis} icon={TestTube} tone="success" />
        <StatCard label="Quebras no mês" value={quebrasMes} icon={HeartCrack} tone="danger" />
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-700">Atalhos rápidos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-card-hover"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${a.bg}`}>
                  <Icon size={20} className={a.color} />
                </div>
                <span className="text-left text-sm font-medium text-ink-800">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ações + Movimentações recentes */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Ações necessárias"
          className="lg:col-span-2"
          action={
            <button
              onClick={() => navigate('/alertas')}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Ver alertas <ArrowRight size={15} />
            </button>
          }
        >
          <ul className="space-y-2.5">
            {acoes.length === 0 && <li className="text-sm text-ink-400">Nenhuma ação necessária.</li>}
            {acoes.map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-ink-100 bg-ink-50 px-4 py-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.cor === 'red' ? 'bg-red-500' : 'bg-amber-400'}`} />
                <span className="text-sm text-ink-700">{a.texto}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Movimentações recentes"
          action={
            <button
              onClick={() => navigate('/movimentacoes')}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Ver todas <ArrowRight size={15} />
            </button>
          }
        >
          <ul className="space-y-3">
            {movimentacoesRecentes.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-800">{m.item}</p>
                  <p className="text-xs text-ink-400">{formatDataBR(m.data)} · {m.horario}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${tipoMovimentacaoColor[m.tipo]}`}>
                  {m.tipo}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
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

      {/* Footer hint */}
      <div className="mt-6 flex items-center gap-2 text-xs text-ink-400">
        <ArrowDownToLine size={14} />
        Atualizado em {formatDataBR('2026-09-01')} às 08:00
      </div>
    </div>
  );
}
