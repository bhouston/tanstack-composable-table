# Composable DataTable Architecture

This DataTable system provides a clean, composable architecture that allows you to mix and match different rendering and pagination components while maintaining the same data management and state logic.

## Architecture Overview

The system is built around three main concepts:

1. **Context-based State Management** - `DataTableContext` manages all table state, data fetching, and pagination logic
2. **Composable Components** - Separate components for rendering (`DataTableRenderer`, `DataTableCardRenderer`) and pagination (`DataTablePagination`)
3. **Container Component** - `DataTableContainer` orchestrates everything using the children pattern

## Core Components

### DataTableContext
- Manages table state, pagination, and data fetching
- Provides `useDataTableContext()` hook for child components
- Handles all the complex pagination logic you mentioned was tricky to get right

### DataTable
- Main container that sets up the context
- **Always requires children** - no default components or prop-based composition
- Clean, explicit composition pattern

### DataTableRenderer
- Renders data in a traditional table format
- Configurable headers, footers, row styling
- Handles loading and empty states

### DataTableCardRenderer
- Renders data in a card layout
- Accepts a custom `renderCard` function
- Perfect for detail listings vs table listings

### DataTablePagination
- Configurable pagination controls
- Multiple layout options (centered, left, right, spread)
- Optional components (page size selector, page input, navigation buttons)

## Usage Patterns

### 1. Basic Table with Pagination
```tsx
<DataTable
  queryKey={['users']}
  fetcher={fetchUsers}
  columns={columns}
  searchParams={searchParams}
  onSearchChange={onSearchChange}
>
  <DataTableRenderer />
  <DataTablePagination />
</DataTable>
```

### 2. Card Layout
```tsx
<DataTable
  queryKey={['users']}
  fetcher={fetchUsers}
  columns={columns}
  searchParams={searchParams}
  onSearchChange={onSearchChange}
>
  <DataTableCardRenderer
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    renderCard={(user) => (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span>{user.role}</span>
      </div>
    )}
  />
  <DataTablePagination layout="centered" />
</DataTable>
```

### 3. Custom Pagination
```tsx
<DataTable
  queryKey={['users']}
  fetcher={fetchUsers}
  columns={columns}
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
```

### 4. Minimal Table (No Pagination)
```tsx
<DataTable
  queryKey={['users']}
  fetcher={fetchUsers}
  columns={columns}
  searchParams={searchParams}
  onSearchChange={onSearchChange}
>
  <DataTableRenderer showFooter={false} />
</DataTable>
```

## Benefits

1. **Separation of Concerns** - Data management is separate from rendering
2. **Reusability** - Mix and match components as needed
3. **Flexibility** - Easy to create new renderers or pagination layouts
4. **Type Safety** - Full TypeScript support with proper generics
5. **Explicit Composition** - Always clear what components are being used
6. **Performance** - Context prevents unnecessary re-renders

## Creating Custom Components

### Custom Renderer
```tsx
function MyCustomRenderer() {
  const { table, isLoading, data } = useDataTableContext();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="my-custom-layout">
      {data?.rows.map((row, index) => (
        <div key={row.id}>
          {/* Custom rendering logic */}
        </div>
      ))}
    </div>
  );
}
```

### Custom Pagination
```tsx
function MyCustomPagination() {
  const { table, pagination, updateSearchParams } = useDataTableContext();
  
  return (
    <div className="my-custom-pagination">
      {/* Custom pagination UI */}
    </div>
  );
}
```

### Using Custom Components
```tsx
<DataTable {...props}>
  <MyCustomRenderer />
  <MyCustomPagination />
</DataTable>
```

## TypeScript Support

All components are fully typed with generics:
- `DataTable<User>` for type-safe data
- `useDataTableContext<User>()` for typed context
- Custom components inherit types from context
