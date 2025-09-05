import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState, ColumnSort, useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from '@tanstack/react-table';

// Generic types for the DataTable context
export interface DataTableResult<T> {
  rows: T[];
  rowCount: number;
}

export interface DataTableContextValue<T> {
  // Data
  data: DataTableResult<T> | undefined;
  isLoading: boolean;
  
  // Table instance
  table: ReturnType<typeof useReactTable<T>>;
  
  // Configuration
  emptyMessage: string;
}

// Create the context
const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

// Hook to use the context
export function useDataTableContext<T>(): DataTableContextValue<T> {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within a DataTableProvider');
  }
  return context;
}

// Provider component
export interface DataTableProviderProps<T> {
  children: ReactNode;
  queryKey: (string | number)[];
  fetcher: (pagination: PaginationState, sorting: ColumnSort) => Promise<DataTableResult<T>>;
  columns: ColumnDef<T, any>[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  sorting: ColumnSort;
  onSortingChange: (sorting: ColumnSort) => void;
  emptyMessage?: string;
}

export function DataTableProvider<T>({
  children,
  queryKey,
  fetcher,
  columns,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  emptyMessage = 'No data found',
}: DataTableProviderProps<T>) {
  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, pagination, sorting],
    queryFn: async () => await fetcher(pagination, sorting),
  });

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    rowCount: data?.rowCount,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater(pagination) 
        : updater;
      onPaginationChange(newPagination);
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' 
        ? updater([sorting]) 
        : updater;
      
      // Convert array back to single sort
      const singleSort = Array.isArray(newSorting) ? newSorting[0] : newSorting;
      if (singleSort) {
        onSortingChange(singleSort);
      }
    },
    state: {
      pagination,
      sorting: [sorting],
    },
    manualPagination: true,
    manualSorting: true,
  });

  const contextValue: DataTableContextValue<T> = {
    data,
    isLoading,
    table,
    emptyMessage,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}