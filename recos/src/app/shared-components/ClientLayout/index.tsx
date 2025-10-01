'use client';
import { useState } from 'react';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { CompanyProvider } from '@/app/context/CompanyContext';
import { ReactNode } from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  return (
    <SidebarProvider>
      <CompanyProvider>
        <Sidebar />
        <Navbar />
        <main
          className={`p-4 bg-gray-100 transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-64'
          } mt-[140px] ${toggleSidebar}`}
        >
          {children}
        </main>
      </CompanyProvider>
    </SidebarProvider>
  );
}






