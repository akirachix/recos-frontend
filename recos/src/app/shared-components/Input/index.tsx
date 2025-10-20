'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'w-full rounded border border-gray-400 focus:outline-none focus:border-purple-600 transition-colors duration-200 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
      },
      error: {
        true: 'border-red-500 focus:border-red-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'error'> & VariantProps<typeof inputVariants> & {
  error?: boolean;
  errorMessage?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ size, error, errorMessage, className, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        className={inputVariants({ size, error, className })}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;