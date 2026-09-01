import { useState } from 'react';
import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { RouterProvider, useRouter } from '@/router/Router';
import { AppLayout } from '@/components/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MateriaisPage, MaterialDetailPage } from '@/pages/MateriaisPage';
import { VidrariasPage, VidrariaDetailPage } from '@/pages/VidrariasPage';
import { MovimentacoesPage } from '@/pages/MovimentacoesPage';
import { AlertasPage } from '@/pages/AlertasPage';
import { RelatoriosPage } from '@/pages/RelatoriosPage';

function AppContent() {
  const { loggedIn } = useAuth();
  const { path } = useRouter();
  const [search, setSearch] = useState('');

  if (!loggedIn) return <LoginPage />;

  // Route resolution
  if (path === '/' || path === '/dashboard') {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <DashboardPage />
      </AppLayout>
    );
  }

  if (path === '/materiais') {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <MateriaisPage search={search} />
      </AppLayout>
    );
  }

  const materialMatch = path.match(/^\/materiais\/(.+)$/);
  if (materialMatch) {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <MaterialDetailPage id={materialMatch[1]} />
      </AppLayout>
    );
  }

  if (path === '/vidrarias') {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <VidrariasPage search={search} />
      </AppLayout>
    );
  }

  const vidrariaMatch = path.match(/^\/vidrarias\/(.+)$/);
  if (vidrariaMatch) {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <VidrariaDetailPage id={vidrariaMatch[1]} />
      </AppLayout>
    );
  }

  if (path === '/movimentacoes') {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <MovimentacoesPage />
      </AppLayout>
    );
  }

  if (path === '/alertas') {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <AlertasPage />
      </AppLayout>
    );
  }

  if (path === '/relatorios') {
    return (
      <AppLayout search={search} onSearchChange={setSearch}>
        <RelatoriosPage />
      </AppLayout>
    );
  }

  // Fallback
  return (
    <AppLayout search={search} onSearchChange={setSearch}>
      <div className="card px-6 py-12 text-center text-sm text-ink-400">
        Página não encontrada.
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
