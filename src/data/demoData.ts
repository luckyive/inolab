export type MaterialStatus = 'normal' | 'attention' | 'low' | 'expired';

export type Material = {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  lote: string;
  validade: string;
  status: MaterialStatus;
  estoqueMinimo: number;
  localArmazenamento: string;
  temperaturaRecomendada: string;
  fornecedor: string;
};

export type Vidraria = {
  id: string;
  codigo: string;
  tipo: string;
  capacidade: string;
  quantidadeTotal: number;
  disponiveis: number;
  emUso: number;
  quebradas: number;
};

export type MovimentacaoTipo = 'Entrada' | 'Retirada' | 'Devolução' | 'Descarte' | 'Quebra';

export type Movimentacao = {
  id: string;
  data: string;
  horario: string;
  item: string;
  tipo: MovimentacaoTipo;
  quantidade: number;
  responsavel: string;
  itemId?: string;
  categoria: 'material' | 'vidraria';
};

export const materiais: Material[] = [
  {
    id: 'm1',
    nome: 'Ácido Clorídrico',
    codigo: 'MAT-001',
    categoria: 'Reagente',
    quantidade: 4800,
    unidade: 'mL',
    lote: 'L-2025-014',
    validade: '2027-03-15',
    status: 'normal',
    estoqueMinimo: 1000,
    localArmazenamento: 'Armário A — Prateleira 2',
    temperaturaRecomendada: 'Temperatura ambiente (15–25 °C)',
    fornecedor: 'Química Industrial Ltda',
  },
  {
    id: 'm2',
    nome: 'Etanol 70%',
    codigo: 'MAT-002',
    categoria: 'Reagente',
    quantidade: 350,
    unidade: 'mL',
    lote: 'L-2025-031',
    validade: '2026-08-20',
    status: 'low',
    estoqueMinimo: 1000,
    localArmazenamento: 'Armário B — Prateleira 1',
    temperaturaRecomendada: 'Temperatura ambiente (15–25 °C)',
    fornecedor: 'LabSupply Distribuidora',
  },
  {
    id: 'm3',
    nome: 'Hidróxido de Sódio',
    codigo: 'MAT-003',
    categoria: 'Reagente',
    quantidade: 1200,
    unidade: 'g',
    lote: 'L-2025-007',
    validade: '2026-09-13',
    status: 'attention',
    estoqueMinimo: 500,
    localArmazenamento: 'Armário A — Prateleira 3',
    temperaturaRecomendada: 'Temperatura ambiente (15–25 °C)',
    fornecedor: 'Química Industrial Ltda',
  },
  {
    id: 'm4',
    nome: 'Ácido Sulfúrico',
    codigo: 'MAT-004',
    categoria: 'Reagente',
    quantidade: 2600,
    unidade: 'mL',
    lote: 'L-2024-022',
    validade: '2028-01-10',
    status: 'normal',
    estoqueMinimo: 800,
    localArmazenamento: 'Armário C — Prateleira 1 (isolado)',
    temperaturaRecomendada: 'Temperatura ambiente (15–25 °C)',
    fornecedor: 'Sigma Reagentes S.A.',
  },
  {
    id: 'm5',
    nome: 'Água Destilada',
    codigo: 'MAT-005',
    categoria: 'Solvente',
    quantidade: 9000,
    unidade: 'mL',
    lote: 'L-2025-040',
    validade: '2027-06-30',
    status: 'normal',
    estoqueMinimo: 3000,
    localArmazenamento: 'Bancada central — Galão',
    temperaturaRecomendada: 'Temperatura ambiente (15–25 °C)',
    fornecedor: 'LabSupply Distribuidora',
  },
];

export const vidrarias: Vidraria[] = [
  {
    id: 'v1',
    codigo: 'VID-001',
    tipo: 'Béquer',
    capacidade: '250 mL',
    quantidadeTotal: 30,
    disponiveis: 22,
    emUso: 6,
    quebradas: 2,
  },
  {
    id: 'v2',
    codigo: 'VID-002',
    tipo: 'Béquer',
    capacidade: '500 mL',
    quantidadeTotal: 20,
    disponiveis: 15,
    emUso: 4,
    quebradas: 1,
  },
  {
    id: 'v3',
    codigo: 'VID-003',
    tipo: 'Erlenmeyer',
    capacidade: '250 mL',
    quantidadeTotal: 25,
    disponiveis: 20,
    emUso: 5,
    quebradas: 0,
  },
  {
    id: 'v4',
    codigo: 'VID-004',
    tipo: 'Proveta',
    capacidade: '100 mL',
    quantidadeTotal: 15,
    disponiveis: 9,
    emUso: 3,
    quebradas: 3,
  },
  {
    id: 'v5',
    codigo: 'VID-005',
    tipo: 'Pipeta volumétrica',
    capacidade: '10 mL',
    quantidadeTotal: 12,
    disponiveis: 8,
    emUso: 4,
    quebradas: 0,
  },
];

export const movimentacoes: Movimentacao[] = [
  { id: 'mov1', data: '2026-09-01', horario: '08:15', item: 'Etanol 70%', tipo: 'Retirada', quantidade: 250, responsavel: 'Técnico do Laboratório', itemId: 'm2', categoria: 'material' },
  { id: 'mov2', data: '2026-09-01', horario: '09:40', item: 'Béquer 250 mL', tipo: 'Retirada', quantidade: 3, responsavel: 'Técnico do Laboratório', itemId: 'v1', categoria: 'vidraria' },
  { id: 'mov3', data: '2026-08-31', horario: '16:20', item: 'Proveta 100 mL', tipo: 'Quebra', quantidade: 1, responsavel: 'Técnico do Laboratório', itemId: 'v4', categoria: 'vidraria' },
  { id: 'mov4', data: '2026-08-31', horario: '14:05', item: 'Ácido Clorídrico', tipo: 'Entrada', quantidade: 2000, responsavel: 'Técnico do Laboratório', itemId: 'm1', categoria: 'material' },
  { id: 'mov5', data: '2026-08-31', horario: '11:30', item: 'Béquer 250 mL', tipo: 'Devolução', quantidade: 2, responsavel: 'Técnico do Laboratório', itemId: 'v1', categoria: 'vidraria' },
  { id: 'mov6', data: '2026-08-30', horario: '17:45', item: 'Hidróxido de Sódio', tipo: 'Retirada', quantidade: 300, responsavel: 'Técnico do Laboratório', itemId: 'm3', categoria: 'material' },
  { id: 'mov7', data: '2026-08-30', horario: '10:10', item: 'Etanol 70%', tipo: 'Descarte', quantidade: 100, responsavel: 'Técnico do Laboratório', itemId: 'm2', categoria: 'material' },
  { id: 'mov8', data: '2026-08-29', horario: '15:55', item: 'Pipeta volumétrica 10 mL', tipo: 'Retirada', quantidade: 2, responsavel: 'Técnico do Laboratório', itemId: 'v5', categoria: 'vidraria' },
  { id: 'mov9', data: '2026-08-29', horario: '09:25', item: 'Erlenmeyer 250 mL', tipo: 'Retirada', quantidade: 4, responsavel: 'Técnico do Laboratório', itemId: 'v3', categoria: 'vidraria' },
  { id: 'mov10', data: '2026-08-28', horario: '13:40', item: 'Béquer 500 mL', tipo: 'Quebra', quantidade: 1, responsavel: 'Técnico do Laboratório', itemId: 'v2', categoria: 'vidraria' },
  { id: 'mov11', data: '2026-08-27', horario: '11:00', item: 'Água Destilada', tipo: 'Retirada', quantidade: 1500, responsavel: 'Técnico do Laboratório', itemId: 'm5', categoria: 'material' },
  { id: 'mov12', data: '2026-08-26', horario: '14:30', item: 'Ácido Sulfúrico', tipo: 'Retirada', quantidade: 200, responsavel: 'Técnico do Laboratório', itemId: 'm4', categoria: 'material' },
  { id: 'mov13', data: '2026-08-25', horario: '10:15', item: 'Béquer 250 mL', tipo: 'Retirada', quantidade: 5, responsavel: 'Técnico do Laboratório', itemId: 'v1', categoria: 'vidraria' },
  { id: 'mov14', data: '2026-08-24', horario: '16:00', item: 'Etanol 70%', tipo: 'Entrada', quantidade: 1000, responsavel: 'Técnico do Laboratório', itemId: 'm2', categoria: 'material' },
  { id: 'mov15', data: '2026-08-22', horario: '09:50', item: 'Hidróxido de Sódio', tipo: 'Retirada', quantidade: 200, responsavel: 'Técnico do Laboratório', itemId: 'm3', categoria: 'material' },
  { id: 'mov16', data: '2026-08-20', horario: '15:30', item: 'Proveta 100 mL', tipo: 'Retirada', quantidade: 2, responsavel: 'Técnico do Laboratório', itemId: 'v4', categoria: 'vidraria' },
  { id: 'mov17', data: '2026-08-18', horario: '11:45', item: 'Erlenmeyer 250 mL', tipo: 'Devolução', quantidade: 3, responsavel: 'Técnico do Laboratório', itemId: 'v3', categoria: 'vidraria' },
  { id: 'mov18', data: '2026-08-15', horario: '08:30', item: 'Ácido Clorídrico', tipo: 'Descarte', quantidade: 150, responsavel: 'Técnico do Laboratório', itemId: 'm1', categoria: 'material' },
];

export const consumoData = [
  { dia: '26/08', valor: 320 },
  { dia: '27/08', valor: 180 },
  { dia: '28/08', valor: 450 },
  { dia: '29/08', valor: 280 },
  { dia: '30/08', valor: 380 },
  { dia: '31/08', valor: 510 },
  { dia: '01/09', valor: 250 },
];

export const quebrasData = [
  { semana: 'Sem 1', valor: 1 },
  { semana: 'Sem 2', valor: 0 },
  { semana: 'Sem 3', valor: 2 },
  { semana: 'Sem 4', valor: 1 },
  { semana: 'Sem 5', valor: 3 },
  { semana: 'Sem 6', valor: 2 },
];

export function statusLabel(s: MaterialStatus): string {
  switch (s) {
    case 'normal': return 'Normal';
    case 'attention': return 'Atenção';
    case 'low': return 'Estoque baixo';
    case 'expired': return 'Vencido';
  }
}

export function statusBadgeClass(s: MaterialStatus): string {
  switch (s) {
    case 'normal': return 'badge-normal';
    case 'attention': return 'badge-attention';
    case 'low': return 'badge-low';
    case 'expired': return 'badge-expired';
  }
}

export const statusDotColor: Record<MaterialStatus, string> = {
  normal: 'bg-emerald-500',
  attention: 'bg-amber-400',
  low: 'bg-orange-500',
  expired: 'bg-red-500',
};

export const tipoMovimentacaoColor: Record<MovimentacaoTipo, string> = {
  'Entrada': 'bg-emerald-50 text-emerald-700',
  'Retirada': 'bg-brand-50 text-brand-700',
  'Devolução': 'bg-ink-100 text-ink-600',
  'Descarte': 'bg-amber-50 text-amber-700',
  'Quebra': 'bg-red-50 text-red-700',
};

export function diasAteValidade(validade: string): number {
  const hoje = new Date('2026-09-01');
  const val = new Date(validade);
  return Math.round((val.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDataBR(dataISO: string): string {
  const [y, m, d] = dataISO.split('-');
  return `${d}/${m}/${y}`;
}

export const responsaveis = ['Técnico do Laboratório'];

export const periodos = [
  { id: 'hoje', label: 'Hoje' },
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: 'mes', label: 'Este mês' },
  { id: 'todos', label: 'Todos' },
];
