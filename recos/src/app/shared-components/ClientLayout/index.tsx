'use client';

import { SidebarProvider, useSidebar } from '@/app/context/SidebarContext';
import { CompanyProvider } from '@/app/context/CompanyContext';
import { ReactNode } from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <CompanyProvider>
        <Sidebar />
        <Navbar />
        <MainContent>{children}</MainContent>
      </CompanyProvider>
    </SidebarProvider>
  );
}

function MainContent({ children }: { children: ReactNode }) {
  const { sidebarWidth } = useSidebar();

  return (
    <main
      className="p-4 transition-all duration-300 mt-[140px]"
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      {children}
    </main>
  );
}
