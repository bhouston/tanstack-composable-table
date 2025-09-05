import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper, PaginationState, ColumnSort } from "@tanstack/react-table";

import { createServerFn, useServerFn } from "@tanstack/react-start";
import z from "zod/v4";
import { FaCircle, FaTrash, FaTable, FaTh, FaSort } from "react-icons/fa";
import { DataTable } from "../components/dataTable/DataTable";
import { DataTableResult } from "../components/dataTable/DataTableContext";
import { useDataTableURLState } from "../components/dataTable/DataTableState";
import { ListView } from "../components/dataTable/ListView";
import { BottomPaginator } from "../components/dataTable/BottomPaginator";
import { CardView } from "../components/dataTable/CardView";
import { useQueryClient } from "@tanstack/react-query";

type User = {
  id: number;
  name: string;
  email: string;
  version: number;
};

type GenerateUsersResult = DataTableResult<User>;

const userIndexToVersion = new Map<number, number>();

// Generate all users (this will be called once per request, but efficiently)
const getAllUsers = (): User[] => {
  return Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    version: userIndexToVersion.get(index + 1) ?? 0,
  }));
};

  // Get all users with current version data
let allUsers = getAllUsers();

const getUsers = (
  pagination: PaginationState,
  sorting: ColumnSort
): GenerateUsersResult => {
  
  // Apply sorting to the entire dataset
  let sortedUsers = [...allUsers].sort((a, b) => {
    let aValue: any = a[sorting.id as keyof User];
    let bValue: any = b[sorting.id as keyof User];
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue);
      return sorting.desc ? -result : result;
    }
    
    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const result = aValue - bValue;
      return sorting.desc ? -result : result;
    }
    
    return 0;
  });
  
  // Now paginate the sorted results
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  
  return {
    rows: paginatedUsers,
    rowCount: allUsers.length,
  };
};

const getUsersServerFn = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      pagination: z.object({ pageIndex: z.number(), pageSize: z.number() }),
      sorting: z.object({
        id: z.string(),
        desc: z.boolean(),
      }),
    })
  )
  .handler(async ({ data: input }) => {
    return getUsers(input.pagination, input.sorting);
  });

  const updateUserVersionServerFn = createServerFn({
    method: "POST",
  })
    .validator(z.object({ id: z.number() }))
    .handler(async ({ data: input }) => {
      userIndexToVersion.set(input.id, ( userIndexToVersion.get(input.id) ?? 0 ) + 1);
      // Version updates will be reflected in the next getAllUsers() call
    });
  


function Home() {
  const getUsers = useServerFn(getUsersServerFn);
  const updateUserVersion = useServerFn(updateUserVersionServerFn);
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  
  // View toggle state
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table');
  
  const fetcher = async (
    pagination: PaginationState,
    sorting: ColumnSort
  ): Promise<GenerateUsersResult> => {
    return await getUsers({ data: { pagination, sorting } });
  };

  // URL-based state management
  const { state, handlers } = useDataTableURLState(
    search,
    navigate,
    {
      defaultPageSize: 10,
      defaultSort: { id: 'name', desc: false }
    }
  );

  const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("version", {
    header: "Version",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => (
      <button
        className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        title="Delete user"
        onClick={() => {
          updateUserVersion({ data: { id: info.row.original.id } });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      >
        <FaCircle className={`w-4 h-4 ${info.row.original.version === 0 ? 'text-green-500' : 'text-red-500'}`} />
      </button>
    ),
  }),
];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your users with this interactive table
                </p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort:
                  </span>
                  <select
                    value={state.sorting.id}
                    onChange={(e) => {
                      const columnId = e.target.value;
                      const isDesc = state.sorting.id === columnId ? !state.sorting.desc : false;
                      
                      handlers.onSortingChange({ id: columnId, desc: isDesc });
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="version">Version</option>
                    <option value="id">ID</option>
                  </select>
                  <button
                    onClick={() => {
                      handlers.onSortingChange({ id: state.sorting.id, desc: !state.sorting.desc });
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                    title="Toggle sort direction"
                  >
                    <FaSort className={`w-4 h-4 ${state.sorting.desc ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* View Toggle Buttons */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    View:
                  </span>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <FaTable className="w-4 h-4" />
                      <span>Table</span>
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        viewMode === 'cards'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <FaTh className="w-4 h-4" />
                      <span>Cards</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DataTable<User>
            queryKey={["users"]}
            fetcher={fetcher}
            columns={columns}
            pagination={state.pagination}
            onPaginationChange={handlers.onPaginationChange}
            sorting={state.sorting}
            onSortingChange={handlers.onSortingChange}
            emptyMessage="No users found"
          >
            {viewMode === 'table' ? (
              <>
                <ListView />
                <BottomPaginator />
              </>
            ) : (
              <>
                <CardView
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
                  renderCard={(user: User) => (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <button
                          className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Update version"
                          onClick={() => {
                            updateUserVersion({ data: { id: user.id } });
                            queryClient.invalidateQueries({ queryKey: ["users"] });
                          }}
                        >
                          <FaCircle className={`w-4 h-4 ${user.version === 0 ? 'text-green-500' : 'text-red-500'}`} />
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.email}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
                          Version {user.version}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  )}
                />
                <BottomPaginator layout="centered" />
              </>
            )}
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: z.object({
    pageIndex: z.number().optional().catch(0),
    pageSize: z.number().optional().catch(10),
    sortId: z.string().optional().catch('name'),
    sortDesc: z.boolean().optional().catch(false),
  }),
});
