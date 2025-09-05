# Composable DataTable Demo

A powerful, flexible, and composable data table component built with TanStack React-Table. This demo showcases how to create reusable table components with server-side pagination, sorting, multiple view modes, and URL state management.

## 🚀 Features

- **Composable Architecture**: Mix and match components to create custom table experiences
- **Server-Side Operations**: Efficient pagination and sorting with TanStack Start server functions
- **Multiple View Modes**: Switch between table and card views seamlessly
- **URL State Management**: Shareable URLs that preserve table state
- **TypeScript Support**: Fully typed for better developer experience
- **Responsive Design**: Works great on desktop and mobile devices
- **Dark Mode**: Built-in dark mode support with Tailwind CSS

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TanStack Table** - Powerful table logic and state management
- **TanStack Start** - Full-stack React framework with server functions
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack Query** - Server state management and caching
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library

## 📦 Installation

This project uses `pnpm` as the package manager. Make sure you have `pnpm` installed:

```bash
npm install -g pnpm
```

Then install dependencies:

```bash
pnpm install
```

## 🏃‍♂️ Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Build

Build the application for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
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