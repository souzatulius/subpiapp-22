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
import Demandas from "./pages/Demandas";
import NotasOficiais from "./pages/NotasOficiais";
import RankingSubs from "./pages/RankingSubs";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import Relatorios from '@/pages/Relatorios';

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
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/demandas" 
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
              path="/ranking-subs" 
              element={
                <ProtectedRoute>
                  <RankingSubs />
                </ProtectedRoute>
              } 
            />
            <Route path="/relatorios" element={
              <ProtectedRoute redirectTo="/login">
                <Relatorios />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
