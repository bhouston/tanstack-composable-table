import React, { ReactNode } from 'react';
import { PaginationState, ColumnSort, ColumnDef } from '@tanstack/react-table';
import { DataTableProvider, DataTableResult } from './DataTableContext';

// Generic types for the DataTable
export interface DataTableProps<T> {
  // Data fetching
  queryKey: (string | number)[];
  fetcher: (pagination: PaginationState, sorting: ColumnSort) => Promise<DataTableResult<T>>;
  
  // Table configuration
  columns: ColumnDef<T, any>[];
  
  // State management
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting: ColumnSort;
  onSortingChange: (sorting: ColumnSort) => void;
  
  // Optional props
  emptyMessage?: string;
  className?: string;
  
  // Required children for composition
  children: ReactNode;
}

export function DataTable<T>({
  queryKey,
  fetcher,
  columns,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  emptyMessage = 'No data found',
  className = '',
  children,
}: DataTableProps<T>) {
  return (
    <DataTableProvider
      queryKey={queryKey}
      fetcher={fetcher}
      columns={columns}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      sorting={sorting}
      onSortingChange={onSortingChange}
      emptyMessage={emptyMessage}
    >
      <div className={className}>
        {children}
      </div>
    </DataTableProvider>
  );
}