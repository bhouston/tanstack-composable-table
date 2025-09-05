import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { DataTableRenderer } from './DataTableRenderer';
import { DataTablePagination } from './DataTablePagination';
import { DataTableCardRenderer } from './DataTableCardRenderer';

// Example data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Example columns
const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

// Example fetcher function
const fetchUsers = async (pagination: any) => {
  // Mock API call
  return {
    rows: [],
    rowCount: 0,
  };
};

// Example search params and handler
const searchParams = { pageIndex: 0, pageSize: 10 };
const onSearchChange = (search: any) => {
  console.log('Search changed:', search);
};

/**
 * Example 1: Basic table with pagination
 */
export function ExampleBasicDataTable() {
  return (
    <DataTable
      queryKey={['users']}
      fetcher={fetchUsers}
      columns={userColumns}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
    >
      <DataTableRenderer />
      <DataTablePagination />
    </DataTable>
  );
}

/**
 * Example 2: Card layout with custom card renderer
 */
export function ExampleCardLayoutDataTable() {
  return (
    <DataTable
      queryKey={['users']}
      fetcher={fetchUsers}
      columns={userColumns}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
    >
      <DataTableCardRenderer
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        renderCard={(user: User) => (
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {user.role}
            </span>
          </div>
        )}
      />
      <DataTablePagination layout="centered" />
    </DataTable>
  );
}

/**
 * Example 3: Custom pagination layout
 */
export function ExampleCustomPaginationDataTable() {
  return (
    <DataTable
      queryKey={['users']}
      fetcher={fetchUsers}
      columns={userColumns}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
    >
      <DataTableRenderer />
      <DataTablePagination 
        layout="centered"
        showPageSizeSelector={false}
        showPageInput={false}
      />
    </DataTable>
  );
}

/**
 * Example 4: Minimal table with no pagination
 */
export function ExampleMinimalDataTable() {
  return (
    <DataTable
      queryKey={['users']}
      fetcher={fetchUsers}
      columns={userColumns}
      searchParams={searchParams}
      onSearchChange={onSearchChange}
    >
      <DataTableRenderer showFooter={false} />
    </DataTable>
  );
}
