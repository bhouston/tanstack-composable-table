import { PaginationState, ColumnSort } from '@tanstack/react-table';

// Helper functions for managing DataTable state with search parameters

export interface DataTableSearchParams {
  pageIndex?: number;
  pageSize?: number;
  sortId?: string;
  sortDesc?: boolean;
}

/**
 * Convert search parameters to pagination state
 */
export function searchParamsToPagination(
  searchParams: DataTableSearchParams,
  defaultPageSize: number = 10
): PaginationState {
  return {
    pageIndex: searchParams.pageIndex ?? 0,
    pageSize: searchParams.pageSize ?? defaultPageSize,
  };
}

/**
 * Convert search parameters to column sort state
 */
export function searchParamsToColumnSort(
  searchParams: DataTableSearchParams,
  defaultSort: ColumnSort = { id: 'id', desc: false }
): ColumnSort {
  if (searchParams.sortId) {
    return {
      id: searchParams.sortId,
      desc: searchParams.sortDesc ?? false,
    };
  }
  return defaultSort;
}

/**
 * Convert pagination state to search parameters
 */
export function paginationToSearchParams(
  pagination: PaginationState,
  defaultPageSize: number = 10
): Partial<DataTableSearchParams> {
  const params: Partial<DataTableSearchParams> = {};
  
  if (pagination.pageIndex > 0) {
    params.pageIndex = pagination.pageIndex;
  } else {
    // Explicitly set to undefined to clear from URL when on page 1
    params.pageIndex = undefined;
  }
  
  if (pagination.pageSize !== defaultPageSize) {
    params.pageSize = pagination.pageSize;
  } else {
    // Explicitly set to undefined to clear from URL when using default page size
    params.pageSize = undefined;
  }
  
  return params;
}

/**
 * Convert column sort state to search parameters
 */
export function columnSortToSearchParams(
  columnSort: ColumnSort,
  defaultSort: ColumnSort = { id: 'id', desc: false }
): Partial<DataTableSearchParams> {
  const params: Partial<DataTableSearchParams> = {};
  
  if (columnSort.id !== defaultSort.id || columnSort.desc !== defaultSort.desc) {
    params.sortId = columnSort.id;
    if (columnSort.desc) {
      params.sortDesc = true;
    } else {
      // Explicitly set to undefined to clear from URL when not descending
      params.sortDesc = undefined;
    }
  } else {
    // Explicitly set to undefined to clear from URL when using default sort
    params.sortId = undefined;
    params.sortDesc = undefined;
  }
  
  return params;
}

/**
 * Create handlers for search parameter-based state management
 */
export function createSearchParamHandlers<T extends DataTableSearchParams>(
  navigate: (options: { search: (prev: T) => T }) => void,
  defaultPageSize: number = 10,
  defaultSort: ColumnSort = { id: 'id', desc: false }
) {
  const onPaginationChange = (pagination: PaginationState) => {
    const paginationParams = paginationToSearchParams(pagination, defaultPageSize);
    navigate({
      search: (prev) => {
        const newSearch = { ...prev };
        
        // Clear or set pagination parameters
        if (paginationParams.pageIndex === undefined) {
          delete newSearch.pageIndex;
        } else {
          newSearch.pageIndex = paginationParams.pageIndex;
        }
        
        if (paginationParams.pageSize === undefined) {
          delete newSearch.pageSize;
        } else {
          newSearch.pageSize = paginationParams.pageSize;
        }
        
        return newSearch;
      },
    });
  };

  const onColumnSortChange = (columnSort: ColumnSort) => {
    const sortParams = columnSortToSearchParams(columnSort, defaultSort);
    navigate({
      search: (prev) => {
        const newSearch = { ...prev };
        
        // Clear or set sort parameters
        if (sortParams.sortId === undefined) {
          delete newSearch.sortId;
        } else {
          newSearch.sortId = sortParams.sortId;
        }
        
        if (sortParams.sortDesc === undefined) {
          delete newSearch.sortDesc;
        } else {
          newSearch.sortDesc = sortParams.sortDesc;
        }
        
        return newSearch;
      },
    });
  };

  return {
    onPaginationChange,
    onColumnSortChange,
  };
}

/**
 * Create handlers for React state-based state management
 */
export function createReactStateHandlers(
  setPagination: (pagination: PaginationState) => void,
  setColumnSort: (columnSort: ColumnSort) => void
) {
  const onPaginationChange = (pagination: PaginationState) => {
    setPagination(pagination);
  };

  const onColumnSortChange = (columnSort: ColumnSort) => {
    setColumnSort(columnSort);
  };

  return {
    onPaginationChange,
    onColumnSortChange,
  };
}
