# Composable DataTable Demo

A powerful, flexible, and composable data table component built with TanStack React-Table. This demo showcases how to create reusable table components with server-side pagination, sorting, multiple view modes, and URL state management.

Live Demo: https://tanstack-composable-datatable-1094236795703.us-central1.run.app/

## 🚀 Features

- **Composable Architecture**: Mix and match components to create custom table experiences with significant code reuse
- **URL State Management**: Supports either React State or shareable URLs that preserve table state
- **TypeScript Support**: Fully typed for better developer experience

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TanStack Table** - Powerful table logic and state management
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Server state management and caching
- **TypeScript** - Type-safe development

## 🧩 Component Architecture

The DataTable is built with a composable architecture that allows you to mix and match components:

### Core Components

- **`DataTable`** - Main container component that provides context
- **`DataTableProvider`** - Context provider for table state and data
- **`ListView`** - Traditional table view with rows and columns
- **`CardView`** - Card-based layout for mobile-friendly display
- **`BottomPaginator`** - Pagination controls at the bottom
- **`PaginationButton`** - Individual pagination buttons
- **`LoadingSpinner`** - Loading state indicator

### State Management

Two state management approaches are demonstrated:

1. **React State** (`useDataTableState`) - For simple applications
2. **URL State** (`useDataTableURLState`) - For shareable URLs and browser history

## 🔧 Usage Example

Here's how to use the composable DataTable:

```tsx
import { DataTable } from './components/dataTable/DataTable'
import { ListView } from './components/dataTable/ListView'
import { BottomPaginator } from './components/dataTable/BottomPaginator'
import { useDataTableState } from './components/dataTable/DataTableState'

function MyTable() {
  const { state, handlers } = useDataTableState({
    defaultPageSize: 10,
    defaultSort: { id: 'name', desc: false }
  })

  const fetcher = async (pagination, sorting) => {
    // Your data fetching logic
    return await fetchData(pagination, sorting)
  }

  const columns = [
    // Your column definitions
  ]

  return (
    <DataTable
      queryKey={['my-data']}
      fetcher={fetcher}
      columns={columns}
      pagination={state.pagination}
      onPaginationChange={handlers.onPaginationChange}
      sorting={state.sorting}
      onSortingChange={handlers.onSortingChange}
    >
      <ListView />
      <BottomPaginator />
    </DataTable>
  )
}
```

## 🎨 Customization

The DataTable is highly customizable:

### Custom Views

Create custom view components by using the table context:

```tsx
import { useDataTable } from './components/dataTable/DataTableContext'

function CustomView() {
  const { data, columns } = useDataTable()
  
  return (
    <div className="custom-layout">
      {data?.rows.map(row => (
        <div key={row.id}>
          {/* Your custom rendering */}
        </div>
      ))}
    </div>
  )
}
```

### Custom Pagination

Build custom pagination controls:

```tsx
function CustomPaginator() {
  const { pagination, onPaginationChange } = useDataTable()
  
  return (
    <div className="custom-pagination">
      {/* Your custom pagination UI */}
    </div>
  )
}
```

## 📖 Demo Examples

### 1. React State Demo (`/react-state`)

Demonstrates the DataTable with React state management. Perfect for applications where you don't need URL persistence.

**Features:**
- 2,000 car listings with realistic data
- Table and card view modes
- Server-side pagination and sorting
- Interactive actions (update car versions)
- React state management

### 2. URL Parameters Demo (`/url-parameters`)

Shows how to integrate table state with URL parameters. Great for shareable links and browser history.

**Features:**
- 1,000 user records
- URL-synced pagination and sorting
- Custom sort controls
- Bookmarkable table states
- Browser history integration


## 📦 Local Dev Setup

This project uses `pnpm` as the package manager. Make sure you have `pnpm` installed:

```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

## 📁 Project Structure

```
src/
├── components/
│   └── dataTable/
│       ├── DataTable.tsx          # Main table component
│       ├── DataTableContext.tsx   # Context provider
│       ├── DataTableState.ts      # State management hooks
│       ├── ListView.tsx           # Table view component
│       ├── CardView.tsx           # Card view component
│       ├── BottomPaginator.tsx    # Pagination component
│       ├── PaginationButton.tsx   # Pagination button
│       └── LoadingSpinner.tsx     # Loading component
├── routes/
│   ├── index.tsx                  # Home page
│   ├── react-state.tsx           # React state demo
│   └── url-parameters.tsx        # URL parameters demo
└── styles/
    └── app.css                   # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for the amazing table and routing libraries
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Icons](https://react-icons.github.io/react-icons/) for the beautiful icons

## 👨‍💻 Author

Created by [Ben Houston](https://github.com/bhouston) • [benhouston3d.com](https://benhouston3d.com)

---

Built with ❤️ using TanStack Table and modern React patterns.