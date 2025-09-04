import React, { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { 
  FaAngleDoubleLeft, 
  FaAngleLeft, 
  FaAngleRight, 
  FaAngleDoubleRight 
} from 'react-icons/fa';
import { GoMoveToEnd, GoMoveToStart } from 'react-icons/go';
import { MdNavigateNext, MdNavigateBefore, MdLastPage, MdFirstPage } from 'react-icons/md';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';

// Generic types for the DataTable component
export interface DataTableResult<T> {
  rows: T[];
  rowCount: number;
}

export interface DataTableProps<T> {
  // Data fetching
  queryKey: (string | number)[];
  fetcher: (pagination: PaginationState) => Promise<DataTableResult<T>>;
  
  // Table configuration
  columns: ColumnDef<T, any>[];
  
  // Optional props
  emptyMessage?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  className?: string;
}

export function DataTable<T>({
  queryKey,
  fetcher,
  columns,
  emptyMessage = 'No data found',
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialPageSize = 10,
  className = '',
}: DataTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [pageInput, setPageInput] = useState<string>('1');
  const [isPageInputValid, setIsPageInputValid] = useState<boolean>(true);

  // Update page input when pagination changes
  useEffect(() => {
    setPageInput((pagination.pageIndex + 1).toString());
  }, [pagination.pageIndex]);

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
    
    if (targetPageIndex !== pagination.pageIndex) {
      setPagination(prev => ({ ...prev, pageIndex: targetPageIndex }));
    }
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

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.rowCount,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true,
  });

  return (
    <div className={className}>
      <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
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
                  <button
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:disabled:hover:bg-gray-800 dark:disabled:hover:text-gray-400 transition-colors duration-150"
                    title="First page"
                  >
                    <MdFirstPage className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:disabled:hover:bg-gray-800 dark:disabled:hover:text-gray-400 transition-colors duration-150"
                    title="Previous page"
                  >
                    <MdNavigateBefore className="w-4 h-4" />
                  </button>
                  
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
                  
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:disabled:hover:bg-gray-800 dark:disabled:hover:text-gray-400 transition-colors duration-150"
                    title="Next page"
                  >
                    <MdNavigateNext className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:disabled:hover:bg-gray-800 dark:disabled:hover:text-gray-400 transition-colors duration-150"
                    title="Last page"
                  >
                    <MdLastPage className="w-4 h-4" />
                  </button>
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
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
