'use client';

import { usePathname } from 'next/navigation';
import { ChevronDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import Button from '../Button';

export default function BottomNav() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const periods = ['Monthly', 'Weekly', 'Daily'];

  const routeToTitle: Record<string, string> = {
    '/': 'Dashboard',
    '/jobs': 'Jobs',
    '/candidates': 'Candidates',
    '/analytics': 'Analytics',
    '/calendar': 'Calendar',
    '/settings': 'Settings',
  };

  const currentTitle = routeToTitle[pathname] || 'Dashboard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="flex flex-row items-center justify-between px-4 sm:px-8 lg:px-16 py-4 gap-4 lg:gap-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1E1B4B]">{currentTitle}</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            variant="period"
            size="md"
            className="flex items-center justify-between w-32 sm:w-40 text-md p-2 rounded transition-colors duration-200 cursor-pointer"
          >
            {selectedPeriod}&emsp;
            <ChevronDownIcon
              className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </Button>
          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in max-h-40 overflow-y-auto"
            >
              <ul className="py-1 text-md text-black" role="listbox">
                {periods.map((period, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 ${
                      selectedPeriod === period ? 'bg-gray-50 font-semibold' : ''
                    }`}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setIsDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedPeriod(period);
                        setIsDropdownOpen(false);
                      }
                    }}
                    role="option"
                    tabIndex={0}
                    aria-selected={selectedPeriod === period}
                  >
                    {period}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button variant="primary" size="md" className="flex items-center sm:size-md cursor-pointer">
          Export
          <ArrowUpTrayIcon className="ml-2 h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}