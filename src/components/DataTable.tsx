import React, { ReactNode } from 'react';
import { PaginationState, ColumnSort, ColumnDef } from '@tanstack/react-table';
import { DataTableProvider, DataTableResult } from './DataTableContext';

// Generic types for the DataTable
export interface DataTableProps<T> {
  // Data fetching
  queryKey: (string | number)[];
  fetcher: (pagination: PaginationState, sorting: ColumnSort | undefined) => Promise<DataTableResult<T>>;
  
  // Table configuration
  columns: ColumnDef<T, any>[];
  
  // Search params configuration
  searchParams: Partial<PaginationState & { sorting: ColumnSort | undefined }>;
  onSearchChange: (search: Partial<PaginationState & { sorting: ColumnSort | undefined }>) => void;
  
  // Optional props
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  defaultSorting?: ColumnSort | undefined;
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
  defaultSorting = undefined,
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
      defaultSorting={defaultSorting}
      emptyMessage={emptyMessage}
    >
      <div className={className}>
        {children}
      </div>
    </DataTableProvider>
  );
}
