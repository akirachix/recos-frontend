'use client';

import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useFetchUser } from '@/app/hooks/useFetchUser';

export default function TopNav() {
  const { user, loading, error } = useFetchUser();

  return (
    <div className="flex items-center justify-end py-4 px-4 sm:px-8 lg:px-16 shadow-md">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <BellIcon className="h-5 sm:h-6 w-5 sm:w-6 cursor-pointer text-gray-500" />
        <div className="flex items-center">
          <UserCircleIcon className="h-6 sm:h-8 w-6 sm:w-8 text-gray-500" />
          {loading ? (
            <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">Loading...</span>
          ) : error ? (
            <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">{error}</span>
          ) : (
            <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">
              {user ? `${user.first_name} ${user.last_name}` : 'User'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}