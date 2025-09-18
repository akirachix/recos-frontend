'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Input from '../Input';

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching general for: ${searchQuery}`);
  };

  return (
    <div className="flex items-center justify-between py-4 px-4 sm:px-8 lg:px-16 shadow-md">
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearch} className="w-full max-w-xs sm:max-w-md lg:max-w-2xl mx-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="md"
              className="pl-8 sm:pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-2 sm:left-3 top-1.5 sm:top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
          </div>
        </form>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <BellIcon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-500" />
        <div className="flex items-center">
          <UserCircleIcon className="h-6 sm:h-8 w-6 sm:w-8 text-gray-500" />
          <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">Joy</span>
        </div>
      </div>
    </div>
  );
}