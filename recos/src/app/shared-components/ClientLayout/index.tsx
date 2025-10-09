'use client';

import { SidebarProvider, useSidebar } from '@/app/context/SidebarContext';
import { CompanyProvider } from '@/app/context/CompanyContext';
import { LogoutModalProvider, useLogoutModal } from '@/app/context/LogoutModalContext';
import { useLogout } from '@/app/hooks/useFetchLogout';
import { ReactNode } from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

function LogoutModal() {
  const { show, close } = useLogoutModal();
  const { logout, loading, error } = useLogout();

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/80">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl py-16 px-12 flex flex-col items-center bg-[#141244] border-4 border-[#eee]">
        <h1 className="text-4xl font-extrabold text-[#8645E8] mb-10 tracking-wide drop-shadow">
          Logout Confirmation
        </h1>
        <p className="text-xl font-medium mb-10 text-center text-white">
          Are you sure you want to logout?
        </p>
        <div className="flex gap-10 w-full justify-center">
          <button
            onClick={logout}
            disabled={loading}
            className={`w-36 py-3 rounded-lg font-bold text-lg border-2 border-[#8645E8]
            bg-[#8645E8] text-white
            hover:bg-white hover:text-[#8645E8] hover:border-[#201c5a]
            transition-all duration-200 cursor-pointer shadow-xl
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            {loading ? "Logging out..." : "Yes"}
          </button>
          <button
            onClick={close}
            className="w-36 py-3 rounded-lg font-bold text-lg border-2 border-[#8645E8]
            bg-transparent text-[#8645E8]
            hover:bg-[#8645E8] hover:text-white transition-colors duration-200 cursor-pointer shadow-xl"
          >
            No
          </button>
        </div>
        {error && (
          <div className="text-red-500 mt-4 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {

  return (
    <LogoutModalProvider>
      <SidebarProvider>
        <CompanyProvider>
          <Sidebar />
          <Navbar />
          <LogoutModal />
          <MainContent>{children}</MainContent>
        </CompanyProvider>
      </SidebarProvider>
    </LogoutModalProvider>
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