import React from "react";
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring focus:ring-purple-200 ${className}`}
    />
  );
}



