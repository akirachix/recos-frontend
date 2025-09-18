'use client';

import { usePathname } from 'next/navigation';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import Button from '../Button';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function BottomNav() {
  const pathname = usePathname();
  const listboxRef = useRef<HTMLDivElement>(null);

  const routeToTitle: Record<string, string> = {
    '/': 'Dashboard',
    '/jobs': 'Jobs',
    '/candidates': 'Candidates',
    '/analytics': 'Analytics',
    '/calendar': 'Calendar',
    '/settings': 'Settings',
  };

  const currentTitle = routeToTitle[pathname] || 'Dashboard';

  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const periods = ['Monthly', 'Weekly', 'Daily'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.innerWidth < 1024 &&
        listboxRef.current &&
        !listboxRef.current.contains(event.target as Node)
      ) {
        setSelectedPeriod(selectedPeriod);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedPeriod]);

  return (
    <div className="flex flex-row items-center justify-between md:px-4 sm:px-8 lg:px-16 py-4 gap-4 lg:gap-0">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1E1B4B]">{currentTitle}</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Listbox value={selectedPeriod} onChange={setSelectedPeriod}>
          <div className="relative" ref={listboxRef}>
            <ListboxButton className="relative w-28 sm:w-32 border rounded px-2 sm:px-3 py-1 sm:py-2 text-left text-sm sm:text-base text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600">
              {selectedPeriod}
              <ChevronDownIcon className="h-4 sm:h-5 w-4 sm:w-5 absolute right-2 top-1 sm:top-2 text-gray-400" />
            </ListboxButton>
            <ListboxOptions className="absolute mt-1 w-28 sm:w-32 bg-white border rounded shadow-lg py-1 z-30">
              {periods.map((period) => (
                <ListboxOption
                  key={period}
                  value={period}
                  className="ui-active:bg-purple-600 ui-active:text-white ui-not-active:bg-white ui-not-active:text-gray-900 px-2 sm:px-3 py-1 cursor-pointer text-sm sm:text-base"
                >
                  {({ selected }) => (
                    <>
                      <span className={selected ? 'font-semibold' : 'font-normal'}>{period}</span>
                      {selected && <CheckIcon className="h-4 sm:h-5 w-4 sm:w-5 inline-block ml-2" />}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
        <Button variant="primary" size="md" className="sm:size-md">
          Export&nbsp;
          <ArrowUpTrayIcon className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}