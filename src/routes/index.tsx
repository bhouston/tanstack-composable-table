import { createFileRoute } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useEffect, useState } from 'react';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import z from 'zod/v4';


export type User = {
  id: number
  name: string
  email: string
}


const generateUsers = (startIndex: number, count: number): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: startIndex + index + 1,
    name: `User ${startIndex + index + 1}`,
    email: `user${startIndex + index + 1}@example.com`,
  }))
}

const getUsersServerFn = createServerFn({
  method: 'GET',
})
  .validator(z.object({ offset: z.number(), limit: z.number() }))
  .handler(async ({ data: input }) => {
    console.info('getUsersServerFn', input)
    const users = generateUsers(input.offset, input.limit)
    console.info('getUsersServerFn', input, users)
    return users;
  })
  
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    id: 'Name',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.email, {
    id: 'Email',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: info => info.column.id,
  }),
]


function Home() {
  const getUsers = useServerFn(getUsersServerFn);
  
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
//  const { data, isLoading } = useQuery({
//    queryKey: ['users',offset, limit],
//    queryFn: async () => await getUsers({ data: { offset, limit } }),
//  });
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUsers({ data: { offset, limit } }).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, [offset, limit]);

  console.log('data', data, 'isLoading', isLoading)
  console.log('offset', offset, 'limit', limit)

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
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
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
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
    </div>
  )
}


export const Route = createFileRoute('/')({
  component: Home,
})