import { useState } from 'react';
import { Beaker, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('tecnico@inopetro.com');
  const [senha, setSenha] = useState('ino lab');
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro('Informe e-mail e senha para entrar.');
      return;
    }
    setErro('');
    login();
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500">
            <Beaker size={24} />
          </div>
          <div>
            <p className="text-lg font-semibold">InoLab</p>
            <p className="text-xs text-ink-400">Inopetro · Laboratórios</p>
          </div>
        </div>

        <div className="max-w-sm">
          <h1 className="text-3xl font-semibold leading-tight">
            Gestão inteligente e acessível para laboratórios
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            Rastreabilidade de materiais e vidrarias, controle de estoque e
            alertas de validade — em uma interface simples e direta.
          </p>
        </div>

        <p className="text-xs text-ink-500">© 2026 Inopetro. Versão demonstração.</p>

        {/* subtle decoration */}
        <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-brand-600/10" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-brand-600/10" />
      </div>

      {/* Right form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Beaker size={24} />
            </div>
            <div>
              <p className="text-lg font-semibold text-ink-900">InoLab</p>
              <p className="text-xs text-ink-500">Inopetro · Laboratórios</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-ink-900">Entrar</h2>
          <p className="mt-1 text-sm text-ink-500">
            Acesse o sistema com suas credenciais.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">E-mail</label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="senha">Senha</label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="senha"
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input px-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
            )}

            <button type="submit" className="btn-primary w-full">
              Entrar
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-ink-200 bg-ink-50 px-4 py-3 text-xs text-ink-500">
            <p className="font-medium text-ink-600">Demonstração</p>
            <p className="mt-1">
              Usuário: <span className="text-ink-700">Técnico do Laboratório</span> · Perfil: <span className="text-ink-700">Técnico</span>
            </p>
            <p className="mt-0.5">
              E-mail e senha já preenchidos — clique em <span className="text-ink-700">Entrar</span> para acessar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
