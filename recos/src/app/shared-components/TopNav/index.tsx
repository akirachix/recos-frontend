'use client';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useFetchProfile } from '@/app/hooks/useFetchProfile'; 
import Image from 'next/image';

export default function TopNav() {
  const { user, loading, error } = useFetchProfile();

  return (
    <div className="flex items-center justify-end py-4 px-4 sm:px-8 lg:px-16 shadow-md">
      <div className="flex items-center space-x-2 sm:space-x-4">        
        <div className="flex items-center">
          {loading ? (
            <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">Loading...</span>
          ) : error ? (
            <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">{error}</span>
          ) : (
            <>
              {user && user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.first_name} ${user.last_name}'s profile picture`}
                  width={32} 
                  height={24} 
                  className="rounded-full h-8 object-cover"
                />
              ) : (
                <UserCircleIcon className="h-6 sm:h-8 w-6 sm:w-8 text-gray-500" />
              )}
              <span className="ml-1 sm:ml-2 text-sm sm:text-base text-gray-700">
                {user ? `${user.first_name} ${user.last_name}` : 'User'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}