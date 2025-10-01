"use client";
import React, { useEffect } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg  max-w-md w-full max-h-[400vh] overflow-auto shadow-lg p-10  space-y-5"
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="float-right text-2xl font-bold mb-4 leading-none select-none hover:text-red-600 transition"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
