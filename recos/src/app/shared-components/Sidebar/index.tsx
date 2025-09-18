'use client';

import { HomeIcon, BriefcaseIcon, UserGroupIcon, ChartBarIcon, CalendarIcon, CogIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { useEffect, useRef } from 'react';

const topMenuItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Candidates', href: '/candidates', icon: UserGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

const bottomMenuItems = [
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, sidebarWidth } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const iconSizeClass = isCollapsed ? 'h-10 w-10' : 'h-7 w-7';

  useEffect(() => {
    const handleClickOutside = (event: { target: unknown; }) => {
      if (
        window.innerWidth < 1024 && 
        !isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed, toggleSidebar]);

  return (
    <>
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-purple-600/20 rounded bg-[#141244] text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#141244] text-white flex flex-col p-4 transition-transform duration-300 z-50 
          ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16 w-0 overflow-hidden' : 'translate-x-0 lg:w-64 w-full'}`}
        style={{ width: `${sidebarWidth}px` }} 
      >
        <div className="mb-8 flex items-center pl-0 lg:pl-2">
          {!isCollapsed && (
            <Image
              src="/logo-white.png"
              alt="Recos Logo"
              width={100}
              height={50}
              className="object-fill"
            />
          )}

          <div className={`flex-1 lg:hidden ${isCollapsed ? 'hidden' : ''}`} />

          <div className={`flex-1 hidden lg:flex ${isCollapsed ? '' : 'hidden'}`} />

          <button
            onClick={toggleSidebar}
            className={`p-2 rounded hover:bg-purple-600/20 lg:hidden ${isCollapsed ? 'hidden' : ''}`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <button
            onClick={toggleSidebar}
            className="p-2 pt-4 rounded hover:bg-purple-600/20 hidden lg:block"
          >
            {isCollapsed ? (
              <ChevronRightIcon className={iconSizeClass} />
            ) : (
              <ChevronLeftIcon className={iconSizeClass} />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div>
             <p className="text-sm">{/*Company Name*/}</p> 
          </div>
        )}

        <div className="flex flex-col justify-between flex-1 mt-8">
          <nav className="flex flex-col space-y-4">
            {topMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-2 rounded ${
                  pathname === item.href ? 'text-purple-600 border-b-3 border-purple-600' : 'hover:bg-purple-600/20'
                } ${isCollapsed ? 'justify-center' : 'space-x-2'}`}
              >
                <item.icon className={iconSizeClass} />
                {!isCollapsed && <span className="text-xl">{item.name}</span>}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col space-y-4">
            {bottomMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-2 rounded ${
                  pathname === item.href ? 'text-purple-600 border-b-3 border-purple-600' : 'hover:bg-purple-600/20'
                } ${isCollapsed ? 'justify-center' : 'space-x-2'}`}
              >
                <item.icon className={iconSizeClass} />
                {!isCollapsed && <span className="text-xl">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}