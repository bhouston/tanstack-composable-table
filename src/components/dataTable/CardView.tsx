import React from 'react';
import { useDataTableContext } from './DataTableContext';
import { LoadingSpinner } from './LoadingSpinner';

export interface CardViewProps<T = any> {
  className?: string;
  cardClassName?: string;
  emptyMessage?: string;
  renderCard: (row: T, index: number) => React.ReactNode;
}

export function CardView<T = any>({
  className = '',
  cardClassName = '',
  emptyMessage,
  renderCard,
}: CardViewProps<T>) {
  const { table, isLoading, data, emptyMessage: contextEmptyMessage } = useDataTableContext<T>();
  
  const finalEmptyMessage = emptyMessage || contextEmptyMessage;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || data.rows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg">
          {finalEmptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {table.getRowModel().rows.map((row, index) => (
        <div
          key={row.id}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-150 ${cardClassName}`}
        >
          {renderCard(row.original, index)}
        </div>
      ))}
    </div>
  );
}
