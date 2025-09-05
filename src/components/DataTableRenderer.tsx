import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from './DataTableContext';
import { LoadingSpinner } from './LoadingSpinner';

export interface DataTableRendererProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  stripedRows?: boolean;
  hoverableRows?: boolean;
  emptyMessage?: string;
}

export function DataTableRenderer({
  className = '',
  showHeader = true,
  showFooter = true,
  stripedRows = true,
  hoverableRows = true,
  emptyMessage,
}: DataTableRendererProps) {
  const { table, isLoading, data, emptyMessage: contextEmptyMessage } = useDataTableContext();
  
  const finalEmptyMessage = emptyMessage || contextEmptyMessage;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || data.rows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg">
          {finalEmptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        {showHeader && (
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
        )}
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row, index) => (
            <tr 
              key={row.id}
              className={`
                transition-colors duration-150
                ${hoverableRows ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                ${stripedRows 
                  ? (index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750')
                  : 'bg-white dark:bg-gray-800'
                }
              `}
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
        
        {showFooter && table.getFooterGroups().some(footerGroup => 
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
    </div>
  );
}
