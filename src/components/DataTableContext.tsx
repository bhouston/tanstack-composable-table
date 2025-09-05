import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState, useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

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
  
  // Pagination state
  pagination: PaginationState;
  updateSearchParams: (newPagination: PaginationState) => void;
  
  // Configuration
  pageSizeOptions: number[];
  defaultPageSize: number;
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
  fetcher: (pagination: PaginationState) => Promise<DataTableResult<T>>;
  columns: ColumnDef<T, any>[];
  searchParams: Partial<PaginationState>;
  onSearchChange: (search: Partial<PaginationState>) => void;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyMessage?: string;
}

export function DataTableProvider<T>({
  children,
  queryKey,
  fetcher,
  columns,
  searchParams,
  onSearchChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
  defaultPageSize = 10,
  emptyMessage = 'No data found',
}: DataTableProviderProps<T>) {
  // Validate pageSizeOptions
  if (!pageSizeOptions || pageSizeOptions.length === 0) {
    throw new Error('pageSizeOptions must be a non-empty array');
  }
  
  if (pageSizeOptions.some(size => size <= 0)) {
    throw new Error('All pageSizeOptions values must be greater than 0');
  }

  // Get pagination state from search params
  const pagination: PaginationState = {
    pageIndex: searchParams.pageIndex ?? 0,
    pageSize: searchParams.pageSize ?? defaultPageSize,
  };

  const updateSearchParams = (newPagination: PaginationState) => {
    newPagination.pageSize = pageSizeOptions.indexOf(newPagination.pageSize) !== -1 ? newPagination.pageSize : pageSizeOptions[0];
    newPagination.pageIndex = Math.min(Math.max(0, newPagination.pageIndex), (data?.rowCount || 0) * newPagination.pageSize - 1);
  
    if (newPagination.pageIndex === pagination.pageIndex && newPagination.pageSize === pagination.pageSize) return;
    
    onSearchChange({
      pageIndex: newPagination.pageIndex === 0 ? undefined : newPagination.pageIndex,
      pageSize: newPagination.pageSize === defaultPageSize ? undefined : newPagination.pageSize,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, pagination.pageIndex, pagination.pageSize],
    queryFn: async () => await fetcher(pagination),
  });

  // Custom pagination change handler that updates search params
  const handlePaginationChange = (updater: any) => {
    const newPagination = typeof updater === 'function' 
      ? updater(pagination) 
      : updater;
    
    updateSearchParams(newPagination);  
  };

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.rowCount,
    onPaginationChange: handlePaginationChange,
    state: {
      pagination,
    },
    manualPagination: true,
  });

  const contextValue: DataTableContextValue<T> = {
    data,
    isLoading,
    table,
    pagination,
    updateSearchParams,
    pageSizeOptions,
    defaultPageSize,
    emptyMessage,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}
