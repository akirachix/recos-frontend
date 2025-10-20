import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={
        " px-4 py-2 font-medium transition " +
        (variant === "primary"
          ? "bg-purple-600 text-white hover:bg-purple-700 "
          : "bg-white text-gray-800 hover:bg-gray-300 ") +
        className
      }
    >
      {props.children}
    </button>
  );
}
