'use client';

import TopNav from '../TopNav';
import BottomNav from '../BottomNav';
import { useSidebar } from '@/app/context/SidebarContext';

export default function Navbar() {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? '64px' : '256px';
  const widthClass = isCollapsed
    ? 'w-[calc(100%-64px)] sm:w-[calc(100%-64px)] lg:w-[calc(100%-64px)]'
    : 'w-[calc(100%-256px)] sm:w-[calc(100%-256px)] lg:w-[calc(100%-256px)]';

  return (
    <div
      className={`fixed top-0 ${widthClass} bg-white z-20`}
      style={{ left: sidebarWidth }}
    >
      <div className="flex flex-col h-full">
        <TopNav />
        <BottomNav />
      </div>
    </div>
  );
}