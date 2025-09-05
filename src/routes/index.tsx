import { createFileRoute, Link } from '@tanstack/react-router'
import { FaTable, FaLink, FaCode, FaRocket, FaGithub, FaPlay } from 'react-icons/fa'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6">
            <FaTable className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Composable DataTable
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A powerful, flexible, and composable data table component built with TanStack React-Table. 
            Features server-side pagination, sorting, multiple view modes, and URL state management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/react-state"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlay className="w-4 h-4 mr-2" />
              View React State Demo
            </Link>
            <Link
              to="/url-parameters"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FaLink className="w-4 h-4 mr-2" />
              View URL Parameters Demo
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <FaCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Composable Architecture
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built with composition in mind. Mix and match components like ListView, CardView, and BottomPaginator to create custom table experiences.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <FaRocket className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Server-Side Operations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Efficient server-side pagination and sorting with TanStack Start server functions. Handles large datasets seamlessly.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <FaLink className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              URL State Management
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Shareable URLs that preserve table state. Perfect for bookmarking specific views or sharing filtered results.
            </p>
          </div>
        </div>

        {/* Demo Examples Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Demo Examples
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* React State Demo */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <FaRocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  React State Demo
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Demonstrates the DataTable with React state management. Perfect for applications where you don't need URL persistence.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 mb-6 space-y-1">
                <li>• 2,000 car listings with realistic data</li>
                <li>• Table and card view modes</li>
                <li>• Server-side pagination and sorting</li>
                <li>• Interactive actions (update car versions)</li>
              </ul>
              <Link
                to="/react-state"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaPlay className="w-4 h-4 mr-2" />
                View Demo
              </Link>
            </div>

            {/* URL Parameters Demo */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <FaLink className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  URL Parameters Demo
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Shows how to integrate table state with URL parameters. Great for shareable links and browser history.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 mb-6 space-y-1">
                <li>• 1,000 user records</li>
                <li>• URL-synced pagination and sorting</li>
                <li>• Custom sort controls</li>
                <li>• Bookmarkable table states</li>
              </ul>
              <Link
                to="/url-parameters"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <FaLink className="w-4 h-4 mr-2" />
                View Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Code Examples Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Code Examples
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Basic Usage */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Usage
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`import { DataTable } from './components/dataTable/DataTable'
import { ListView, BottomPaginator } from './components/dataTable'
import { useDataTableState } from './components/dataTable/DataTableState'

function MyTable() {
  const { state, handlers } = useDataTableState({
    defaultPageSize: 10,
    defaultSort: { id: 'name', desc: false }
  })

  const fetcher = async (pagination, sorting) => {
    return await fetchData(pagination, sorting)
  }

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'status', header: 'Status' }
  ]

  return (
    <DataTable
      queryKey={['users']}
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
}`}
                </pre>
              </div>
            </div>

            {/* URL State Management */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                URL State Management
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`import { useDataTableURLState } from './components/dataTable/DataTableState'

function MyTableWithURL() {
  const navigate = useNavigate()
  const search = useSearch()
  
  const { state, handlers } = useDataTableURLState(
    search,
    navigate,
    {
      defaultPageSize: 10,
      defaultSort: { id: 'name', desc: false }
    }
  )

  // URL will automatically sync with table state
  // /my-page?pageIndex=2&pageSize=20&sortId=email&sortDesc=true

  return (
    <DataTable
      queryKey={['users']}
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
}`}
                </pre>
              </div>
            </div>

            {/* Custom Card View */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Custom Card View
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`import { CardView } from './components/dataTable/CardView'

function MyCardTable() {
  return (
    <DataTable
      queryKey={['products']}
      fetcher={fetcher}
      columns={columns}
      pagination={state.pagination}
      onPaginationChange={handlers.onPaginationChange}
      sorting={state.sorting}
      onSortingChange={handlers.onSortingChange}
    >
      <CardView
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
        renderCard={(product) => (
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              $` + `{product.price.toLocaleString()}
            </div>
          </div>
        )}
      />
      <BottomPaginator layout="centered" />
    </DataTable>
  )
}`}
                </pre>
              </div>
            </div>

            {/* Server Function */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Server Function
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const getDataServerFn = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      pagination: z.object({ 
        pageIndex: z.number(), 
        pageSize: z.number() 
      }),
      sorting: z.object({
        id: z.string(),
        desc: z.boolean(),
      }),
    })
  )
  .handler(async ({ data: input }) => {
    // Your server-side logic here
    const { pagination, sorting } = input
    
    // Fetch data from database
    const data = await fetchFromDatabase({
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      sortBy: sorting.id,
      sortOrder: sorting.desc ? 'DESC' : 'ASC'
    })
    
    return {
      rows: data.items,
      rowCount: data.totalCount
    }
  })

// Use in component
const getData = useServerFn(getDataServerFn)
const fetcher = (pagination, sorting) => 
  getData({ data: { pagination, sorting } })`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Technical Stack
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">TS</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">TypeScript</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Type-safe development</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">RT</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">TanStack Table</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Powerful table logic</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">RS</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">TanStack Start</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Full-stack framework</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 dark:text-teal-400 font-bold text-lg">TW</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Tailwind CSS</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Utility-first styling</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600 dark:text-gray-400">
          <p>Built with ❤️ using TanStack Table and modern React patterns</p>
          <p className="mt-2">
            Created by <a href="https://github.com/bhouston" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Ben Houston</a> • 
            <a href="https://benhouston3d.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">benhouston3d.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
