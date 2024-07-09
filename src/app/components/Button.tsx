import React, { useState } from 'react';
import Loading from './Loading';

interface ButtonProps {
  onClick: () => void;
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  state?: 'default' | 'success' | 'error';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  loading,
  children,
  disabled = false,
  state = 'default',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        w-28
        text-sm font-medium
        border
        ${state ==='default' ? 'hover:border-gray-700' : state === 'success' ? 'hover:border-green-500' : 'hover:border-red-500'}
        rounded-md
        bg-black text-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        transition-colors duration-200
        ${disabled || loading ? 'opacity-50 cursor-not-allowed border-gray-700' : 'hover:'}
        ${className}
      `}
    >
      {loading ? <Loading /> : children}
    </button>
  );
};

export default Button;
