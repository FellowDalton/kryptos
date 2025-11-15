/**
 * Authentication context
 * Provides authentication state and functions throughout the app
 * Phase 3: Will integrate with Supabase Auth
 * TODO: Implement with user state, login, logout, and session management
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Placeholder implementation
  const value: AuthContextType = {
    user: null,
    login: async () => {},
    logout: async () => {},
    loading: false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
