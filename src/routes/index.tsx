import { createFileRoute } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'

import { useEffect, useState } from 'react';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { useQuery } from '@tanstack/react-query';


export type User = {
  id: number
  name: string
  email: string
}


const generateUsers = (pageIndex: number, pageSize: number): User[] => {

  const startIndex = pageIndex * pageSize;
  return Array.from({ length: pageSize }, (_, index) => ({
    id: startIndex + index + 1,
    name: `User ${startIndex + index + 1}`,
    email: `user${startIndex + index + 1}@example.com`,
  }))
}

const getUsersServerFn = createServerFn({
  method: 'GET',
})
  .validator(z.object({ pagination: z.object({ pageIndex: z.number(), pageSize: z.number() }) }))
  .handler(async ({ data: input }) => {
    console.info('getUsersServerFn', input)
    const users = generateUsers(input.pagination.pageIndex, input.pagination.pageSize)
    console.info('getUsersServerFn', input, users)
    return users;
  })
  
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor(row => row.name, {
    id: 'name',
    header: 'Name',
    cell: info => info.getValue()
  }),
  columnHelper.accessor(row => row.email, {
    id: 'email',
    header: 'Email',
    cell: info => info.getValue()
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => (
      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 dark:bg-red-500 dark:hover:bg-red-600">
        Delete
      </button>
    )
  })
]


function Home() {
  const getUsers = useServerFn(getUsersServerFn);
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

    const { data, isLoading } = useQuery({
    queryKey: ['users',pagination.pageIndex, pagination.pageSize],
    queryFn: async () => await getUsers({ data: { pagination } }),
  });

  console.log('data', data, 'isLoading', isLoading)
  console.log('pagination', pagination)

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your users with this interactive table
            </p>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading users...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th 
                          key={header.id}
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
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
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
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
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-t border-gray-200 dark:border-gray-600"
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
          
          {!isLoading && data && data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-lg">
                No users found
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export const Route = createFileRoute('/')({
  component: Home,
})