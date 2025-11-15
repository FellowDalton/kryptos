/**
 * Session context
 * Provides current meditation session state and playback information
 * TODO: Implement with active session, playback state, and progress tracking
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';

interface SessionContextType {
  activeSession: any;
  isPlaying: boolean;
  currentTime: number;
  setActiveSession: (session: any) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  // Placeholder implementation
  const value: SessionContextType = {
    activeSession: null,
    isPlaying: false,
    currentTime: 0,
    setActiveSession: () => {}
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within SessionProvider');
  }
  return context;
}
