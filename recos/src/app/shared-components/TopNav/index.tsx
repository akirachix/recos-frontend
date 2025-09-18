'use client';

import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function TopNav() {

  return (
    <div className="flex items-center justify-end py-4 px-4 sm:px-8 lg:px-16 shadow-md">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <BellIcon className="h-5 sm:h-6 w-5 sm:w-6 cursor-pointer text-gray-500" />
        <div className="flex items-center">
          <UserCircleIcon className="h-6 sm:h-8 w-6 sm:w-8 text-gray-500" />
          <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">Joy</span>
        </div>
      </div>
    </div>
  );
}