import React from 'react';

interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PaginationButton({ 
  onClick, 
  disabled, 
  title, 
  children, 
  className = '' 
}: PaginationButtonProps) {
  const baseClasses = "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:disabled:hover:bg-gray-800 dark:disabled:hover:text-gray-400 transition-colors duration-150";
  
  const visibilityClass = disabled ? 'invisible' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${visibilityClass} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}
