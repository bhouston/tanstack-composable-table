import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper, PaginationState, ColumnSort } from "@tanstack/react-table";

import { createServerFn, useServerFn } from "@tanstack/react-start";
import z from "zod/v4";
import { FaCircle, FaTrash, FaTable, FaTh, FaCar } from "react-icons/fa";
import { DataTable } from "../components/DataTable";
import { DataTableResult } from "../components/DataTableContext";
import { createReactStateHandlers } from "../components/DataTableHelpers";
import { ListView } from "../components/ListView";
import { BottomPaginator } from "../components/BottomPaginator";
import { CardView } from "../components/CardView";
import { useQueryClient } from "@tanstack/react-query";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  price: number;
  version: number;
};

type GenerateCarsResult = DataTableResult<Car>;

// Mock data arrays for deterministic generation
const carMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", 
  "Audi", "Nissan", "Hyundai", "Kia", "Volkswagen", "Mazda",
  "Subaru", "Lexus", "Acura", "Infiniti", "Cadillac", "Lincoln",
  "Jeep", "Ram", "GMC", "Buick", "Chrysler", "Dodge"
];

const carModels = [
  "Camry", "Accord", "F-150", "Silverado", "3 Series", "C-Class",
  "A4", "Altima", "Elantra", "Sorento", "Jetta", "CX-5",
  "Outback", "ES", "TLX", "Q50", "XT5", "Navigator",
  "Wrangler", "1500", "Sierra", "Enclave", "Pacifica", "Charger",
  "Corolla", "Civic", "Escape", "Equinox", "X3", "GLC",
  "Q5", "Rogue", "Tucson", "Sportage", "Tiguan", "CX-9"
];

const carColors = [
  "Black", "White", "Silver", "Gray", "Red", "Blue", "Green",
  "Brown", "Gold", "Beige", "Orange", "Yellow", "Purple", "Maroon"
];

const carIndexToVersion = new Map<number, number>();

const generateCars = (
  pagination: PaginationState,
  sorting: ColumnSort
): GenerateCarsResult => {
  // Generate all cars first
  const allCars: Car[] = Array.from({ length: 2000 }, (_, index) => {
    const carIndex = index + 1;
    const makeIndex = carIndex % carMakes.length;
    const modelIndex = Math.floor(carIndex / carMakes.length) % carModels.length;
    const colorIndex = (carIndex * 3) % carColors.length;
    const year = 2015 + (carIndex % 10); // Years 2015-2024
    const basePrice = 15000 + (carIndex % 50000); // $15k-$65k
    const mileage = 10000 + (carIndex % 200000); // 10k-210k miles
    
    return {
      id: carIndex,
      make: carMakes[makeIndex],
      model: carModels[modelIndex],
      year: year,
      color: carColors[colorIndex],
      mileage: mileage,
      price: basePrice,
      version: carIndexToVersion.get(carIndex) ?? 0,
    };
  });
  
  // Apply sorting
  const sortedCars = [...allCars].sort((a, b) => {
    let aValue: any = a[sorting.id as keyof Car];
    let bValue: any = b[sorting.id as keyof Car];
    
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
  
  // Apply pagination
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const array = sortedCars.slice(startIndex, startIndex + pagination.pageSize);
  return {
    rows: array,
    rowCount: allCars.length,
  };
};

const getCarsServerFn = createServerFn({
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
    return generateCars(input.pagination, input.sorting);
  });

const updateCarVersionServerFn = createServerFn({
  method: "POST",
})
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data: input }) => {
    carIndexToVersion.set(input.id, (carIndexToVersion.get(input.id) ?? 0) + 1);
  });

function CarsPage() {
  const getCars = useServerFn(getCarsServerFn);
  const updateCarVersion = useServerFn(updateCarVersionServerFn);
  const queryClient = useQueryClient();
  
  // View toggle state
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table');
  
  // DataTable state using React useState
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 12 });
  const [columnSort, setColumnSort] = React.useState<ColumnSort>({ id: 'make', desc: false });
  
  const fetcher = async (
    pagination: PaginationState,
    sorting: ColumnSort
  ): Promise<GenerateCarsResult> => {
    return await getCars({ data: { pagination, sorting } });
  };

  // Create handlers for React state management
  const { onPaginationChange, onColumnSortChange } = createReactStateHandlers(
    setPagination,
    setColumnSort
  );

  const columnHelper = createColumnHelper<Car>();

  const columns = [
    columnHelper.accessor("make", {
      header: "Make",
    }),
    columnHelper.accessor("model", {
      header: "Model",
    }),
    columnHelper.accessor("year", {
      header: "Year",
    }),
    columnHelper.accessor("color", {
      header: "Color",
    }),
    columnHelper.accessor("mileage", {
      header: "Mileage",
      cell: (info) => `${info.getValue().toLocaleString()} mi`,
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => `$${info.getValue().toLocaleString()}`,
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
          title="Update car version"
          onClick={() => {
            updateCarVersion({ data: { id: info.row.original.id } });
            queryClient.invalidateQueries({ queryKey: ["cars"] });
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
                  Used Car Listings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Browse our extensive inventory of quality used vehicles
                </p>
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
          <DataTable<Car>
            queryKey={["cars"]}
            fetcher={fetcher}
            columns={columns}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            columnSort={columnSort}
            onColumnSortChange={onColumnSortChange}
            emptyMessage="No cars found"
          >
            {viewMode === 'table' ? (
              <>
                <ListView />
                <BottomPaginator />
              </>
            ) : (
              <>
                <CardView
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6"
                  renderCard={(car: Car) => (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FaCar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {car.year} {car.make} {car.model}
                          </h3>
                        </div>
                        <button
                          className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Update car version"
                          onClick={() => {
                            updateCarVersion({ data: { id: car.id } });
                            queryClient.invalidateQueries({ queryKey: ["cars"] });
                          }}
                        >
                          <FaCircle className={`w-4 h-4 ${car.version === 0 ? 'text-green-500' : 'text-red-500'}`} />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Color: <span className="font-medium text-gray-900 dark:text-white">{car.color}</span>
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Mileage: <span className="font-medium text-gray-900 dark:text-white">{car.mileage.toLocaleString()} mi</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            ${car.price.toLocaleString()}
                          </span>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
                            Version {car.version}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          ID: {car.id}
                        </div>
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

export const Route = createFileRoute("/cars")({
  component: CarsPage,
  validateSearch: z.object({}),
});
