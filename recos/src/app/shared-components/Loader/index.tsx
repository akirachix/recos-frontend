'use client';

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'; 
  message?: string; 
  className?: string; 
  spinnerClassName?: string; 
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  message,
  className = '',
  spinnerClassName = '',
}) => {
  const sizeStyles = {
    sm: 'h-8 w-8 ',
    md: 'h-12 w-12 ',
    lg: 'h-16 w-16 ',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
     <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 ${sizeStyles[size]} ${spinnerClassName}`} ></div>
      {message && (
        <span className="mt-2 text-lg text-gray-600 font-medium">{message}</span>
      )}
    </div>
  );
};

export default Loader;