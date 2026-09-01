import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthState = {
  loggedIn: boolean;
  user: { nome: string; perfil: string } | null;
};

type AuthContextValue = AuthState & {
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loggedIn: false,
    user: null,
  });

  const login = () =>
    setState({ loggedIn: true, user: { nome: 'Técnico do Laboratório', perfil: 'Técnico' } });
  const logout = () => setState({ loggedIn: false, user: null });

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
