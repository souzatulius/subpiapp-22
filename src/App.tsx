
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Demandas from "./pages/comunicacao/Demandas";
import NotasOficiais from "./pages/comunicacao/NotasOficiais";
import Relatorios from "./pages/comunicacao/Relatorios";
import RankingSubs from "./pages/zeladoria/RankingSubs";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import CadastrarDemanda from './pages/dashboard/comunicacao/CadastrarDemanda';
import ResponderDemandas from './pages/dashboard/comunicacao/ResponderDemandas';
import CriarNotaOficial from './pages/dashboard/comunicacao/CriarNotaOficial';
import AprovarNotaOficial from './pages/dashboard/comunicacao/AprovarNotaOficial';
import RelatoriosDashboard from './pages/dashboard/comunicacao/Relatorios';
import ConsultarDemandas from './pages/dashboard/comunicacao/ConsultarDemandas';
import ConsultarNotas from './pages/dashboard/comunicacao/ConsultarNotas';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard Communication Section Routes - Updated Structure */}
            <Route 
              path="/dashboard/comunicacao/cadastrar" 
              element={
                <ProtectedRoute>
                  <CadastrarDemanda />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/comunicacao/consultar-demandas" 
              element={
                <ProtectedRoute>
                  <ConsultarDemandas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/comunicacao/responder" 
              element={
                <ProtectedRoute>
                  <ResponderDemandas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/comunicacao/criar-nota" 
              element={
                <ProtectedRoute>
                  <CriarNotaOficial />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/comunicacao/aprovar-nota" 
              element={
                <ProtectedRoute>
                  <AprovarNotaOficial />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/comunicacao/consultar-notas" 
              element={
                <ProtectedRoute>
                  <ConsultarNotas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/comunicacao/relatorios" 
              element={
                <ProtectedRoute>
                  <RelatoriosDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Comunicação Routes (Legacy) */}
            <Route 
              path="/comunicacao/demandas" 
              element={
                <ProtectedRoute>
                  <Demandas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/comunicacao/notas-oficiais" 
              element={
                <ProtectedRoute>
                  <NotasOficiais />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/comunicacao/relatorios" 
              element={
                <ProtectedRoute>
                  <Relatorios />
                </ProtectedRoute>
              } 
            />
            
            {/* Zeladoria Routes */}
            <Route 
              path="/dashboard/zeladoria/ranking-subs" 
              element={
                <ProtectedRoute>
                  <RankingSubs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/zeladoria/ranking-subs" 
              element={
                <ProtectedRoute>
                  <RankingSubs />
                </ProtectedRoute>
              } 
            />
            
            {/* Settings Route */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy routes for redirect purposes */}
            <Route 
              path="/demandas" 
              element={
                <ProtectedRoute>
                  <Demandas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/demandas/nova" 
              element={
                <ProtectedRoute>
                  <Demandas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notas-oficiais" 
              element={
                <ProtectedRoute>
                  <NotasOficiais />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notas-oficiais/nova" 
              element={
                <ProtectedRoute>
                  <NotasOficiais />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <ProtectedRoute>
                  <Relatorios />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ranking-subs" 
              element={
                <ProtectedRoute>
                  <RankingSubs />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
