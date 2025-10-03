'use client'; 

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextType | null>(null);
// Changed from undefined to null for default value. This avoids React warnings and is a more common pattern.

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarWidth(isCollapsed ? 256 : 64);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
