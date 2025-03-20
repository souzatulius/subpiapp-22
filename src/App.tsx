
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Demandas from '@/pages/Demandas';
import NotasOficiais from '@/pages/NotasOficiais';
import Settings from '@/pages/Settings';
import RankingSubprefeituras from '@/pages/RankingSubprefeituras';
import AuthCallback from '@/components/AuthCallback';
import { AuthProvider } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComunicacoesOficiais from './pages/ComunicacoesOficiais';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/demandas" element={<ProtectedRoute><Demandas /></ProtectedRoute>} />
            <Route path="/notas-oficiais" element={<ProtectedRoute><NotasOficiais /></ProtectedRoute>} />
            <Route path="/ranking-subprefeituras" element={<ProtectedRoute><RankingSubprefeituras /></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/comunicacoes-oficiais" element={<ProtectedRoute><ComunicacoesOficiais /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
