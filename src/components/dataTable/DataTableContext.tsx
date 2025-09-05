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
  
  // Pagination state
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  
  // Sorting state
  columnSort: ColumnSort;
  onColumnSortChange: (columnSort: ColumnSort) => void;
  
  // Configuration
  pageSizeOptions: number[];
  emptyMessage: string;
  sortableColumns: Array<{ id: string; header: string }>;
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
  columnSort: ColumnSort;
  onColumnSortChange: (columnSort: ColumnSort) => void;
  pageSizeOptions?: number[];
  emptyMessage?: string;
}

export function DataTableProvider<T>({
  children,
  queryKey,
  fetcher,
  columns,
  pagination,
  onPaginationChange,
  columnSort,
  onColumnSortChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
  emptyMessage = 'No data found',
}: DataTableProviderProps<T>) {
  // Validate pageSizeOptions
  if (!pageSizeOptions || pageSizeOptions.length === 0) {
    throw new Error('pageSizeOptions must be a non-empty array');
  }
  
  if (pageSizeOptions.some(size => size <= 0)) {
    throw new Error('All pageSizeOptions values must be greater than 0');
  }

  // Extract sortable columns from the columns definition
  const sortableColumns = columns
    .filter(col => col.enableSorting !== false && ((col as any).accessorKey || col.id))
    .map(col => ({
      id: (col as any).accessorKey as string || col.id as string,
      header: typeof col.header === 'string' ? col.header : col.id as string,
    }));

  const handlePaginationChange = (newPagination: PaginationState) => {
    // Validate page size is in allowed options
    const validatedPageSize = pageSizeOptions.includes(newPagination.pageSize) 
      ? newPagination.pageSize 
      : pageSizeOptions[0];
    
    // Clamp page index to valid range
    const maxPageIndex = Math.max(0, Math.ceil((data?.rowCount || 0) / validatedPageSize) - 1);
    const validatedPageIndex = Math.min(Math.max(0, newPagination.pageIndex), maxPageIndex);
    
    const validatedPagination = {
      pageIndex: validatedPageIndex,
      pageSize: validatedPageSize,
    };
    
    onPaginationChange(validatedPagination);
  };

  const handleColumnSortChange = (newColumnSort: ColumnSort) => {
    onColumnSortChange(newColumnSort);
  };

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, pagination, columnSort],
    queryFn: async () => await fetcher(pagination, columnSort),
  });

  // Custom pagination change handler for react-table
  const handleTablePaginationChange = (updater: any) => {
    const newPagination = typeof updater === 'function' 
      ? updater(pagination) 
      : updater;
    
    handlePaginationChange(newPagination);  
  };

  // Custom sorting change handler for react-table
  const handleTableSortingChange = (updater: any) => {
    const newSorting = typeof updater === 'function' 
      ? updater([columnSort]) 
      : updater;
    
    // Convert array back to single sort
    const singleSort = Array.isArray(newSorting) ? newSorting[0] : newSorting;
    if (singleSort) {
      handleColumnSortChange(singleSort);
    }
  };

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    rowCount: data?.rowCount,
    onPaginationChange: handleTablePaginationChange,
    onSortingChange: handleTableSortingChange,
    state: {
      pagination,
      sorting: [columnSort],
    },
    manualPagination: true,
    manualSorting: true,
  });

  const contextValue: DataTableContextValue<T> = {
    data,
    isLoading,
    table,
    pagination,
    onPaginationChange: handlePaginationChange,
    columnSort,
    onColumnSortChange: handleColumnSortChange,
    pageSizeOptions,
    emptyMessage,
    sortableColumns,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}
