import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { useState } from "react";

// Páginas públicas
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerified from "./pages/EmailVerified";
import NotFound from "./pages/NotFound";
import AuthCallback from "./components/AuthCallback";

// Layouts e proteção
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Páginas principais do usuário
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

// Comunicação
import CadastrarDemanda from "./pages/dashboard/comunicacao/CadastrarDemanda";
import ResponderDemandas from "./pages/dashboard/comunicacao/ResponderDemandas";
import CriarNotaOficial from "./pages/dashboard/comunicacao/CriarNotaOficial";
import AprovarNotaOficial from "./pages/dashboard/comunicacao/AprovarNotaOficial";
import RelatoriosPage from "./pages/dashboard/comunicacao/Relatorios";
import ConsultarDemandas from "./pages/dashboard/comunicacao/ConsultarDemandas";
import ConsultarNotas from "./pages/dashboard/comunicacao/ConsultarNotas";
import ComunicacaoDashboard from "./pages/dashboard/comunicacao/Comunicacao";
import CadastrarRelease from "./pages/dashboard/comunicacao/CadastrarRelease";
import ListarReleases from "./pages/dashboard/comunicacao/ListarReleases";

// Zeladoria
import RankingSubs from "./pages/dashboard/zeladoria/RankingSubs";

// Admin
import UserPermissionsList from "./pages/admin/UserPermissionsList";

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>

              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Rotas protegidas fora do layout */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              {/* Área administrativa */}
              <Route path="/admin/users-permissions" element={<ProtectedRoute><UserPermissionsList /></ProtectedRoute>} />

              {/* Rotas com layout compartilhado */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />

                {/* Comunicação */}
                <Route path="comunicacao" element={<ComunicacaoDashboard />} />
                <Route path="comunicacao/cadastrar" element={<CadastrarDemanda />} />
                <Route path="comunicacao/responder" element={<ResponderDemandas />} />
                <Route path="comunicacao/demandas" element={<ConsultarDemandas />} />
                <Route path="comunicacao/criar-nota" element={<CriarNotaOficial />} />
                <Route path="comunicacao/aprovar-nota" element={<AprovarNotaOficial />} />
                <Route path="comunicacao/notas" element={<ConsultarNotas />} />
                <Route path="comunicacao/relatorios" element={<RelatoriosPage />} />
                <Route path="comunicacao/cadastrar-release" element={<CadastrarRelease />} />
                <Route path="comunicacao/releases" element={<ListarReleases />} />

                {/* Zeladoria */}
                <Route path="zeladoria/ranking-subs" element={<RankingSubs />} />
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
