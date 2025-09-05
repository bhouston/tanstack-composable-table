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
  
  // Explicit state management
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  columnSort: ColumnSort;
  onColumnSortChange: (columnSort: ColumnSort) => void;
  
  // Optional props
  emptyMessage?: string;
  pageSizeOptions?: number[];
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
  columnSort,
  onColumnSortChange,
  emptyMessage = 'No data found',
  pageSizeOptions = [10, 20, 30, 40, 50],
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
      columnSort={columnSort}
      onColumnSortChange={onColumnSortChange}
      pageSizeOptions={pageSizeOptions}
      emptyMessage={emptyMessage}
    >
      <div className={className}>
        {children}
      </div>
    </DataTableProvider>
  );
}
