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
  updateSearchParams: (newPagination: PaginationState) => void;
  
  // Sorting state
  sorting: ColumnSort | undefined;
  updateSorting: (newSorting: ColumnSort | undefined) => void;
  
  // Configuration
  pageSizeOptions: number[];
  defaultPageSize: number;
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
  fetcher: (pagination: PaginationState, sorting: ColumnSort | undefined) => Promise<DataTableResult<T>>;
  columns: ColumnDef<T, any>[];
  searchParams: Partial<PaginationState & { sorting: ColumnSort | undefined }>;
  onSearchChange: (search: Partial<PaginationState & { sorting: ColumnSort | undefined }>) => void;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyMessage?: string;
  defaultSorting?: ColumnSort | undefined;
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
  defaultSorting = undefined,
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

  // Get sorting state from search params
  const sorting: ColumnSort | undefined = (searchParams as any).sorting ?? defaultSorting;

  // Extract sortable columns from the columns definition
  const sortableColumns = columns
    .filter(col => col.enableSorting !== false && ((col as any).accessorKey || col.id))
    .map(col => ({
      id: (col as any).accessorKey as string || col.id as string,
      header: typeof col.header === 'string' ? col.header : col.id as string,
    }));

  const updateSearchParams = (newPagination: PaginationState) => {
    newPagination.pageSize = pageSizeOptions.indexOf(newPagination.pageSize) !== -1 ? newPagination.pageSize : pageSizeOptions[0];
    newPagination.pageIndex = Math.min(Math.max(0, newPagination.pageIndex), (data?.rowCount || 0) * newPagination.pageSize - 1);
  
    if (newPagination.pageIndex === pagination.pageIndex && newPagination.pageSize === pagination.pageSize) return;
    
    onSearchChange({
      pageIndex: newPagination.pageIndex === 0 ? undefined : newPagination.pageIndex,
      pageSize: newPagination.pageSize === defaultPageSize ? undefined : newPagination.pageSize,
      ...(sorting && { sorting }),
    });
  };

  const updateSorting = (newSorting: ColumnSort | undefined) => {
    if (JSON.stringify(newSorting) === JSON.stringify(sorting)) return;
    
    onSearchChange({
      pageIndex: pagination.pageIndex === 0 ? undefined : pagination.pageIndex,
      pageSize: pagination.pageSize === defaultPageSize ? undefined : pagination.pageSize,
      ...(newSorting && { sorting: newSorting }),
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: async () => await fetcher(pagination, sorting),
  });

  // Custom pagination change handler that updates search params
  const handlePaginationChange = (updater: any) => {
    const newPagination = typeof updater === 'function' 
      ? updater(pagination) 
      : updater;
    
    updateSearchParams(newPagination);  
  };

  // Custom sorting change handler that updates search params
  const handleSortingChange = (updater: any) => {
    const newSorting = typeof updater === 'function' 
      ? updater(sorting ? [sorting] : []) 
      : updater;
    
    // Convert array back to single sort or undefined
    const singleSort = Array.isArray(newSorting) ? newSorting[0] : newSorting;
    updateSorting(singleSort);
  };

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    rowCount: data?.rowCount,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    state: {
      pagination,
      sorting: sorting ? [sorting] : [],
    },
    manualPagination: true,
    manualSorting: true,
  });

  const contextValue: DataTableContextValue<T> = {
    data,
    isLoading,
    table,
    pagination,
    updateSearchParams,
    sorting,
    updateSorting,
    pageSizeOptions,
    defaultPageSize,
    emptyMessage,
    sortableColumns,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}
