import React, { ReactNode } from 'react';
import { PaginationState, ColumnDef } from '@tanstack/react-table';
import { DataTableProvider, DataTableResult } from './DataTableContext';

// Generic types for the DataTable
export interface DataTableProps<T> {
  // Data fetching
  queryKey: (string | number)[];
  fetcher: (pagination: PaginationState) => Promise<DataTableResult<T>>;
  
  // Table configuration
  columns: ColumnDef<T, any>[];
  
  // Search params configuration
  searchParams: Partial<PaginationState>;
  onSearchChange: (search: Partial<PaginationState>) => void;
  
  // Optional props
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  className?: string;
  
  // Required children for composition
  children: ReactNode;
}

export function DataTable<T>({
  queryKey,
  fetcher,
  columns,
  searchParams,
  onSearchChange,
  emptyMessage = 'No data found',
  pageSizeOptions = [10, 20, 30, 40, 50],
  defaultPageSize = 10,
  className = '',
  children,
}: DataTableProps<T>) {
  return (
    <DataTableProvider
      queryKey={queryKey}
      fetcher={fetcher}
      columns={columns}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
      pageSizeOptions={pageSizeOptions}
      defaultPageSize={defaultPageSize}
      emptyMessage={emptyMessage}
    >
      <div className={className}>
        {children}
      </div>
    </DataTableProvider>
  );
}
