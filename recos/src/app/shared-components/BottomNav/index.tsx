'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from '@/app/context/SidebarContext';

export default function BottomNav() {
  const pathname = usePathname();

  const routeToTitle: Record<string, string> = {
    '/': 'Dashboard',
    '/jobs': 'Jobs',
    '/candidates': 'Candidates',
    '/analytics': 'Analytics',
    '/calendar': 'Calendar',
    '/settings': 'Settings',
  };

  const getTitleFromPath = (path: string) => {
    let currentTitle = 'Dashboard';
    for (const route in routeToTitle) {
      if (path.startsWith(route) && route.length > (Object.keys(routeToTitle).find(r => path.startsWith(r) && r.length > route.length)?.length || 0)) {
        currentTitle = routeToTitle[route];
      }
    }
    return currentTitle;
  };

  const currentTitle = getTitleFromPath(pathname);
  const {sidebarWidth} = useSidebar(); 
  

  return (
    <div className="flex items-center p-8">
        <h1 className={`text-2xl sm:text-3xl pl-2 font-semibold text-[#1E1B4B] ${sidebarWidth == 84 ? 'pl-6' : 'pl-2'}`}
        >{currentTitle}</h1>
    </div>
  );
}