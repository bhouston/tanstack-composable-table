import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch, Link, getRouteApi } from '@tanstack/react-router';

import { MdNavigateNext, MdNavigateBefore, MdLastPage, MdFirstPage } from 'react-icons/md';
import { PaginationButton } from './PaginationButton';
import { LoadingSpinner } from './LoadingSpinner';

// Generic types for the DataTable component
export interface DataTableResult<T> {
  rows: T[];
  rowCount: number;
}

export interface DataTableProps<T, TSearch = { pageIndex?: number; pageSize?: number }> {
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
  defaultPageSize?: number; // Default page size for clean URLs
  className?: string;
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
}: DataTableProps<T>) {
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

  const [pageInput, setPageInput] = useState<string>((pagination.pageIndex + 1).toString());
  const [isPageInputValid, setIsPageInputValid] = useState<boolean>(true);

  // Update page input when pagination changes from URL
  useEffect(() => {
    setPageInput((pagination.pageIndex + 1).toString());
  }, [pagination.pageIndex]);

  const updateSearchParams = (newPagination: PaginationState) => {
    newPagination.pageSize = pageSizeOptions.indexOf(newPagination.pageSize) !== -1 ? newPagination.pageSize : pageSizeOptions[0];
    newPagination.pageIndex = Math.min( Math.max(0, newPagination.pageIndex), ( data?.rowCount || 0 ) * newPagination.pageSize - 1  );
  
    if( newPagination.pageIndex === pagination.pageIndex && newPagination.pageSize === pagination.pageSize ) return;
    
    onSearchChange({
      pageIndex: newPagination.pageIndex === 0 ? undefined : newPagination.pageIndex,
      pageSize: newPagination.pageSize === defaultPageSize ? undefined : newPagination.pageSize,
    });
  };

  const handlePageInputChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setPageInput(numericValue);
    
    if (numericValue === '') {
      setIsPageInputValid(true); // Allow empty input while typing
      return;
    }
    
    const pageNumber = parseInt(numericValue, 10);
    const maxPages = data ? Math.ceil(data.rowCount / pagination.pageSize) : 1;
    
    setIsPageInputValid(pageNumber >= 1 && pageNumber <= maxPages);
  };

  const handlePageInputSubmit = () => {
    if (pageInput === '' || !isPageInputValid) return;
    
    const pageNumber = parseInt(pageInput, 10);
    const targetPageIndex = pageNumber - 1;

    updateSearchParams({ pageIndex: targetPageIndex, pageSize: pagination.pageSize });
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
    }
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

  return (
    <div className={className}>
      <div className="overflow-x-auto">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th 
                          key={header.id}
                          className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.map((row, index) => (
                    <tr 
                      key={row.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'
                      }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id}
                          className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                {/* Only render footer if there's actual footer content */}
                {table.getFooterGroups().some(footerGroup => 
                  footerGroup.headers.some(header => 
                    header.column.columnDef.footer && !header.isPlaceholder
                  )
                ) && (
                  <tfoot className="bg-gray-50 dark:bg-gray-700">
                    {table.getFooterGroups().map(footerGroup => (
                      <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                          <th 
                            key={header.id}
                            className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-t border-gray-200 dark:border-gray-600"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </tfoot>
                )}
              </table>
            )}
          </div>
          
          {!isLoading && data && data.rows.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-lg">
                {emptyMessage}
              </div>
            </div>
          )}
          
          {/* Pagination Controls */}
          {!isLoading && data && data.rows.length > 0 && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left: Empty space for balance */}
                <div></div>
                
                {/* Center: Navigation Buttons with Page Input in Middle */}
                <div className="flex items-center space-x-2">
                  <PaginationButton
                    onClick={() => updateSearchParams({ pageIndex: 0, pageSize: pagination.pageSize })}
                    disabled={!table.getCanPreviousPage()}
                    title="First page"
                  >
                    <MdFirstPage className="w-4 h-4" />
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => updateSearchParams({ pageIndex: pagination.pageIndex - 1, pageSize: pagination.pageSize })}
                    disabled={!table.getCanPreviousPage()}
                    title="Previous page"
                  >
                    <MdNavigateBefore className="w-4 h-4" />
                  </PaginationButton>
                  {/* Page Input in the middle */}
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Page</span>
                    <input
                      type="text"
                      value={pageInput}
                      onChange={(e) => handlePageInputChange(e.target.value)}
                      onKeyPress={handlePageInputKeyPress}
                      onBlur={handlePageInputSubmit}
                      className={`w-16 px-2 py-1 text-sm text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 ${
                        isPageInputValid
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}
                      placeholder="1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      of {table.getPageCount()}
                    </span>
                  </div>
                  
                  <PaginationButton
                    onClick={() => updateSearchParams({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize })}
                    disabled={!table.getCanNextPage()}
                    title="Next page"
                  >
                    <MdNavigateNext className="w-4 h-4" />
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => updateSearchParams({ pageIndex: table.getPageCount() - 1, pageSize: pagination.pageSize })}
                    disabled={!table.getCanNextPage()}
                    title="Last page"
                  >
                    <MdLastPage className="w-4 h-4" />
                  </PaginationButton>
                </div>
                
                {/* Right: Page Size Selector */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="pageSize" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rows per page:
                  </label>
                  <select
                    id="pageSize"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      const newPageSize = Number(e.target.value);
                      updateSearchParams({
                        pageSize: newPageSize,
                        pageIndex: Math.floor( ( pagination.pageIndex * pagination.pageSize ) / newPageSize ),
                      });
                    }}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                  >
                    {pageSizeOptions.map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
      </div>
  );
}
