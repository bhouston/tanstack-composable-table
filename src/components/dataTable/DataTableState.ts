import React from 'react';
import { PaginationState, ColumnSort } from '@tanstack/react-table';

// Unified state management for DataTable
export interface DataTableState {
  pagination: PaginationState;
  sorting: ColumnSort;
}

export interface DataTableStateConfig {
  defaultPageSize?: number;
  defaultSort?: ColumnSort;
}

// URL search params interface
export interface DataTableSearchParams {
  pageIndex?: number;
  pageSize?: number;
  sortId?: string;
  sortDesc?: boolean;
}

// State management hooks
export function useDataTableState(
  config: DataTableStateConfig = {}
): {
  state: DataTableState;
  setState: (updates: Partial<DataTableState>) => void;
  handlers: {
    onPaginationChange: (pagination: PaginationState) => void;
    onSortingChange: (sorting: ColumnSort) => void;
  };
} {
  const { defaultPageSize = 10, defaultSort = { id: 'id', desc: false } } = config;
  
  const [state, setState] = React.useState<DataTableState>({
    pagination: { pageIndex: 0, pageSize: defaultPageSize },
    sorting: defaultSort,
  });

  const updateState = (updates: Partial<DataTableState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const onPaginationChange = (pagination: PaginationState) => {
    updateState({ pagination });
  };

  const onSortingChange = (sorting: ColumnSort) => {
    updateState({ sorting });
  };

  return {
    state,
    setState: updateState,
    handlers: { onPaginationChange, onSortingChange },
  };
}

// URL-based state management
export function useDataTableURLState(
  searchParams: DataTableSearchParams,
  navigate: (options: { search: (prev: any) => any }) => void,
  config: DataTableStateConfig = {}
): {
  state: DataTableState;
  handlers: {
    onPaginationChange: (pagination: PaginationState) => void;
    onSortingChange: (sorting: ColumnSort) => void;
  };
} {
  const { defaultPageSize = 10, defaultSort = { id: 'id', desc: false } } = config;

  const state: DataTableState = {
    pagination: {
      pageIndex: searchParams.pageIndex ?? 0,
      pageSize: searchParams.pageSize ?? defaultPageSize,
    },
    sorting: {
      id: searchParams.sortId ?? defaultSort.id,
      desc: searchParams.sortDesc ?? defaultSort.desc,
    },
  };

  const onPaginationChange = (pagination: PaginationState) => {
    const updates: Partial<DataTableSearchParams> = {};
    
    if (pagination.pageIndex > 0) updates.pageIndex = pagination.pageIndex;
    else updates.pageIndex = undefined;
    
    if (pagination.pageSize !== defaultPageSize) updates.pageSize = pagination.pageSize;
    else updates.pageSize = undefined;

    navigate({
      search: (prev: any) => {
        const newSearch = { ...prev };
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined) delete newSearch[key];
          else newSearch[key] = value;
        });
        return newSearch;
      },
    });
  };

  const onSortingChange = (sorting: ColumnSort) => {
    const updates: Partial<DataTableSearchParams> = {};
    
    if (sorting.id !== defaultSort.id || sorting.desc !== defaultSort.desc) {
      updates.sortId = sorting.id;
      updates.sortDesc = sorting.desc || undefined;
    } else {
      updates.sortId = undefined;
      updates.sortDesc = undefined;
    }

    navigate({
      search: (prev: any) => {
        const newSearch = { ...prev };
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined) delete newSearch[key];
          else newSearch[key] = value;
        });
        return newSearch;
      },
    });
  };

  return {
    state,
    handlers: { onPaginationChange, onSortingChange },
  };
}
