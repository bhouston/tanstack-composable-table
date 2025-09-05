import React, { useState, useEffect } from 'react';
import { MdNavigateNext, MdNavigateBefore, MdLastPage, MdFirstPage } from 'react-icons/md';
import { PaginationButton } from './PaginationButton';
import { useDataTableContext } from './DataTableContext';

export interface BottomPaginatorProps {
  className?: string;
  showPageSizeSelector?: boolean;
  showPageInput?: boolean;
  showNavigationButtons?: boolean;
  layout?: 'centered' | 'left' | 'right' | 'spread';
  pageSizeOptions?: number[];
}

export function BottomPaginator({
  className = '',
  showPageSizeSelector = true,
  showPageInput = true,
  showNavigationButtons = true,
  layout = 'spread',
  pageSizeOptions = [10, 20, 30, 40, 50],
}: BottomPaginatorProps) {
  const { table } = useDataTableContext();
  
  const [pageInput, setPageInput] = useState<string>((table.getState().pagination.pageIndex + 1).toString());
  const [isPageInputValid, setIsPageInputValid] = useState<boolean>(true);

  // Update page input when pagination changes
  useEffect(() => {
    setPageInput((table.getState().pagination.pageIndex + 1).toString());
  }, [table.getState().pagination.pageIndex]);

  const handlePageInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPageInput(numericValue);
    
    if (numericValue === '') {
      setIsPageInputValid(true);
      return;
    }
    
    const pageNumber = parseInt(numericValue, 10);
    const maxPages = table.getPageCount();
    setIsPageInputValid(pageNumber >= 1 && pageNumber <= maxPages);
  };

  const handlePageInputSubmit = () => {
    if (pageInput === '' || !isPageInputValid) return;
    
    const pageNumber = parseInt(pageInput, 10);
    const targetPageIndex = pageNumber - 1;
    table.setPageIndex(targetPageIndex);
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
    }
  };

  const renderNavigationButtons = () => {
    if (!showNavigationButtons) return null;

    return (
      <div className="flex items-center space-x-2">
        <PaginationButton
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          title="First page"
        >
          <MdFirstPage className="w-4 h-4" />
        </PaginationButton>
        <PaginationButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="Previous page"
        >
          <MdNavigateBefore className="w-4 h-4" />
        </PaginationButton>
      </div>
    );
  };

  const renderPageInput = () => {
    if (!showPageInput) return null;

    return (
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
    );
  };

  const renderNextButtons = () => {
    if (!showNavigationButtons) return null;

    return (
      <div className="flex items-center space-x-2">
        <PaginationButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="Next page"
        >
          <MdNavigateNext className="w-4 h-4" />
        </PaginationButton>
        <PaginationButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          title="Last page"
        >
          <MdLastPage className="w-4 h-4" />
        </PaginationButton>
      </div>
    );
  };

  const renderPageSizeSelector = () => {
    if (!showPageSizeSelector) return null;

    return (
      <div className="flex items-center space-x-2">
        <label htmlFor="pageSize" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rows per page:
        </label>
        <select
          id="pageSize"
          value={table.getState().pagination.pageSize}
          onChange={e => {
            const newPageSize = Number(e.target.value);
            table.setPageSize(newPageSize);
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
    );
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'centered': return 'justify-center';
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'spread':
      default: return 'justify-between';
    }
  };

  return (
    <div className={`px-6 py-4 ${className}`}>
      <div className={`flex items-center ${getLayoutClasses()}`}>
        {layout === 'spread' && <div></div>}
        
        <div className="flex items-center space-x-2">
          {renderNavigationButtons()}
          {renderPageInput()}
          {renderNextButtons()}
        </div>
        
        {layout === 'spread' && renderPageSizeSelector()}
        {layout !== 'spread' && (
          <div className="ml-4">
            {renderPageSizeSelector()}
          </div>
        )}
      </div>
    </div>
  );
}