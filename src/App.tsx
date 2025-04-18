
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { useState } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerified from "./pages/EmailVerified";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import Settings from "./pages/Settings";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import UserProfile from "./pages/UserProfile";
import ChartTest from './pages/ChartTest';

// Dashboard Pages
import CadastrarDemanda from './pages/dashboard/comunicacao/CadastrarDemanda';
import ResponderDemandas from './pages/dashboard/comunicacao/ResponderDemandas';
import CriarNotaOficial from './pages/dashboard/comunicacao/CriarNotaOficial';
import AprovarNotaOficial from './pages/dashboard/comunicacao/AprovarNotaOficial';
import RelatoriosPage from './pages/dashboard/comunicacao/Relatorios';
import ConsultarDemandas from './pages/dashboard/comunicacao/ConsultarDemandas';
import ConsultarNotas from './pages/dashboard/comunicacao/ConsultarNotas';
import RankingSubs from './pages/dashboard/zeladoria/RankingSubs';
import ComunicacaoDashboard from './pages/dashboard/comunicacao/Comunicacao';
import CadastrarRelease from './pages/dashboard/comunicacao/CadastrarRelease';
import ListarReleases from './pages/dashboard/comunicacao/ListarReleases';
import ESICPage from './pages/dashboard/esic/ESICPage';

// Admin Pages
import UserPermissionsList from './pages/admin/UserPermissionsList';

import FeedbackProvider from './components/ui/feedback-provider';

function App() {
  // Create a new QueryClient instance within the component
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
        refetchOnWindowFocus: false
      }
    }
  }));

  return (
    <FeedbackProvider>
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <TooltipProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/email-verified" element={<EmailVerified />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* Dashboard with shared layout */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    {/* Dashboard home page as index route */}
                    <Route index element={<DashboardPage />} />
                    
                    {/* Comunicação routes - consistent naming and paths */}
                    <Route path="comunicacao" element={<ComunicacaoDashboard />} />
                    <Route path="comunicacao/cadastrar" element={<CadastrarDemanda />} />
                    <Route path="comunicacao/responder" element={<ResponderDemandas />} />
                    <Route path="comunicacao/demandas" element={<ConsultarDemandas />} />
                    <Route path="comunicacao/criar-nota" element={<CriarNotaOficial />} />
                    <Route path="comunicacao/aprovar-nota" element={<AprovarNotaOficial />} />
                    <Route path="comunicacao/notas" element={<ConsultarNotas />} />
                    <Route path="comunicacao/relatorios" element={<RelatoriosPage />} />
                    
                    {/* Release routes */}
                    <Route path="comunicacao/cadastrar-release" element={<CadastrarRelease />} />
                    <Route path="comunicacao/releases" element={<ListarReleases />} />
                    
                    {/* e-SIC routes */}
                    <Route path="esic" element={<ESICPage />} />
                    <Route path="esic/cadastrar" element={<ESICPage />} />
                    <Route path="esic/consultar" element={<ESICPage />} />
                    
                    {/* Zeladoria routes */}
                    <Route path="zeladoria/ranking-subs" element={<RankingSubs />} />
                  </Route>

                  {/* Settings route */}
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                  {/* Admin routes */}
                  <Route path="/admin/users-permissions" element={<ProtectedRoute><UserPermissionsList /></ProtectedRoute>} />

                  {/* Profile route */}
                  <Route path="/profile" element={<UserProfile />} />
                  
                  {/* Search route */}
                  <Route path="/search" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<div className="p-6">Resultados da Pesquisa</div>} />
                  </Route>

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />

                  {/* Add the chart test route */}
                  <Route path="/chart-test" element={<ChartTest />} />
                </Routes>
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </FeedbackProvider>
  );
}

export default App;
