'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LogoutModalContextType {
  show: boolean;
  open: () => void;
  close: () => void;
}

const LogoutModalContext = createContext<LogoutModalContextType | null>(null);

export function LogoutModalProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  return (
    <LogoutModalContext.Provider value={{ show, open, close }}>
      {children}
    </LogoutModalContext.Provider>
  );
}

// ✅ This is a NAMED export!
export function useLogoutModal() {
  const context = useContext(LogoutModalContext);
  if (context === null) {
    throw new Error('useLogoutModal must be used within LogoutModalProvider');
  }
  return context;
}