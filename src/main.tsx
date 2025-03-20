import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RankingSubprefeituras from './pages/RankingSubprefeituras'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Settings from './pages/Settings'
import Demandas from './pages/Demandas'
import Comunicados from './pages/Comunicados'

// Import our new page
import ComunicacoesOficiais from './pages/ComunicacoesOficiais';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ranking-subprefeituras',
    element: (
      <ProtectedRoute>
        <RankingSubprefeituras />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/demandas',
    element: (
      <ProtectedRoute>
        <Demandas />
      </ProtectedRoute>
    ),
  },
  {
    path: '/comunicados',
    element: (
      <ProtectedRoute>
        <Comunicados />
      </ProtectedRoute>
    ),
  },
  // In the route definition, add:
  {
    path: '/comunicacoes-oficiais',
    element: (
      <ProtectedRoute>
        <ComunicacoesOficiais />
      </ProtectedRoute>
    ),
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
