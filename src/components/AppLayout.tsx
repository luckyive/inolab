import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  TestTube,
  ArrowLeftRight,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  Beaker,
  FileBarChart,
  QrCode as QrCodeIcon,
} from 'lucide-react';
import { useRouter } from '@/router/Router';
import { useAuth } from '@/auth/AuthContext';
import { QrCode } from '@/components/QrCode';

type NavItem = {
  label: string;
  icon: ReactNode;
  path: string;
  match: (p: string) => boolean;
};

const navMain: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={19} />, path: '/dashboard', match: (p) => p === '/dashboard' || p === '/' },
  { label: 'Materiais', icon: <FlaskConical size={19} />, path: '/materiais', match: (p) => p.startsWith('/materiais') },
  { label: 'Vidrarias', icon: <TestTube size={19} />, path: '/vidrarias', match: (p) => p.startsWith('/vidrarias') },
];

const navOps: NavItem[] = [
  { label: 'Movimentações', icon: <ArrowLeftRight size={19} />, path: '/movimentacoes', match: (p) => p === '/movimentacoes' },
  { label: 'Alertas', icon: <Bell size={19} />, path: '/alertas', match: (p) => p === '/alertas' },
  { label: 'Relatórios', icon: <FileBarChart size={19} />, path: '/relatorios', match: (p) => p === '/relatorios' },
];

export function AppLayout({ children, search, onSearchChange }: {
  children: ReactNode;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const { path, navigate } = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  const renderNavGroup = (items: NavItem[], title: string) => (
    <div className="mb-4">
      <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">{title}</p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const active = item.match(path);
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const Sidebar = (
    <div className="flex h-full flex-col bg-ink-900 text-ink-100">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-ink-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Beaker size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold leading-tight text-white">InoLab</p>
          <p className="truncate text-xs text-ink-400">Inopetro · Laboratórios</p>
        </div>
        <button
          className="ml-auto rounded-lg p-1.5 text-ink-400 hover:bg-ink-800 hover:text-white lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {renderNavGroup(navMain, 'Principal')}
        {renderNavGroup(navOps, 'Operação')}
      </nav>

      {/* Acesso Rápido */}
      <div className="border-t border-ink-800 px-4 py-4">
        <div className="rounded-lg bg-ink-800 p-3">
          <div className="mb-2 flex items-center gap-2">
            <QrCodeIcon size={15} className="text-brand-400" />
            <p className="text-xs font-semibold text-white">Acesso rápido</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-1.5">
              <QrCode size={72} />
            </div>
            <p className="text-[11px] leading-snug text-ink-400">
              Escaneie para acessar o InoLab em um dispositivo autorizado.
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-ink-800 px-3 py-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-xs font-semibold text-white">
            TL
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.nome}</p>
            <p className="truncate text-xs text-ink-400">{user?.perfil}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{Sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">{Sidebar}</aside>
        </>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3 lg:px-6">
          <button
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar material ou vidraria..."
              className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition"
            />
          </div>

          <div className="ml-auto hidden items-center gap-2 text-sm text-ink-500 sm:flex">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Sistema ativo
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
