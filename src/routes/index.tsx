import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper, PaginationState } from "@tanstack/react-table";

import { createServerFn, useServerFn } from "@tanstack/react-start";
import z from "zod/v4";
import { FaCircle, FaTrash } from "react-icons/fa";
import { DataTable, DataTableResult } from "../components/DataTable";
import { useQueryClient } from "@tanstack/react-query";

type User = {
  id: number;
  name: string;
  email: string;
  version: number;
};

type GenerateUsersResult = DataTableResult<User>;

const userIndexToVersion = new Map<number, number>();

const generateUsers = (
  pageIndex: number,
  pageSize: number
): GenerateUsersResult => {
  const startIndex = pageIndex * pageSize;
  const array: User[] = Array.from({ length: pageSize }, (_, index) => ({
    id: startIndex + index + 1,
    name: `User ${startIndex + index + 1}`,
    email: `user${startIndex + index + 1}@example.com`,
    version: userIndexToVersion.get(startIndex + index + 1) ?? 0,
  }));
  return {
    rows: array,
    rowCount: 1000,
  };
};

const getUsersServerFn = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      pagination: z.object({ pageIndex: z.number(), pageSize: z.number() }),
    })
  )
  .handler(async ({ data: input }) => {
    return generateUsers(input.pagination.pageIndex, input.pagination.pageSize);
  });

  const updateUserVersionServerFn = createServerFn({
    method: "POST",
  })
    .validator(z.object({ id: z.number() }))
    .handler(async ({ data: input }) => {
      userIndexToVersion.set(input.id, ( userIndexToVersion.get(input.id) ?? 0 ) + 1);
    });
  


function Home() {
  const getUsers = useServerFn(getUsersServerFn);
  const updateUserVersion = useServerFn(updateUserVersionServerFn);
  const queryClient = useQueryClient();
  
  const fetcher = async (
    pagination: PaginationState
  ): Promise<GenerateUsersResult> => {
    return await getUsers({ data: { pagination } });
  };

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your users with this interactive table
            </p>
          </div>
          <DataTable<User>
            queryKey={["users"]}
            fetcher={fetcher}
            columns={columns}
            emptyMessage="No users found"
            defaultPageSize={10}
          />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: z.object({
    pageIndex: z.number().optional().default(0),
    pageSize: z.number().optional().default(10),
  }),
});
