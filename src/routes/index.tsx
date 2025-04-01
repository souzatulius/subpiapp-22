
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import CadastrarDemanda from '@/pages/dashboard/comunicacao/CadastrarDemanda';
import ConsultarDemandas from '@/pages/dashboard/comunicacao/ConsultarDemandas';
import ResponderDemandas from '@/pages/dashboard/comunicacao/ResponderDemandas';
import CriarNotaOficial from '@/pages/dashboard/comunicacao/CriarNotaOficial';
import ConsultarNotas from '@/pages/dashboard/comunicacao/ConsultarNotas';
import AprovarNotaOficial from '@/pages/dashboard/comunicacao/AprovarNotaOficial';
import Comunicacao from '@/pages/dashboard/comunicacao/Comunicacao';
import Relatorios from '@/pages/Relatorios';
import Settings from '@/pages/Settings';
import EmailVerified from '@/pages/EmailVerified';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import AdminProtectedRoute from '@/components/layouts/AdminProtectedRoute';
import RankingSubs from '@/pages/dashboard/zeladoria/RankingSubs';
import DashboardManagement from '@/pages/settings/DashboardManagement';

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // If auth is loading, don't render routes yet
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      
      {/* Redirect root to dashboard if logged in, otherwise to login */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      
      {/* Protected routes with DashboardLayout */}
      <Route element={<ProtectedRoute>{<Outlet />}</ProtectedRoute>}>
        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Comunicacao routes */}
          <Route path="/dashboard/comunicacao" element={<Comunicacao />} />
          
          {/* Protected Admin routes */}
          <Route element={<AdminProtectedRoute>{<Outlet />}</AdminProtectedRoute>}>
            <Route path="/dashboard/comunicacao/cadastrar-demanda" element={<CadastrarDemanda />} />
            <Route path="/dashboard/comunicacao/cadastrar" element={<CadastrarDemanda />} />
            <Route path="/dashboard/comunicacao/consultar-demandas" element={<ConsultarDemandas />} />
            <Route path="/dashboard/comunicacao/responder-demandas" element={<ResponderDemandas />} />
            <Route path="/dashboard/comunicacao/criar-nota-oficial" element={<CriarNotaOficial />} />
            <Route path="/dashboard/comunicacao/consultar-notas" element={<ConsultarNotas />} />
            <Route path="/dashboard/comunicacao/aprovar-nota" element={<AprovarNotaOficial />} />
            <Route path="/settings/dashboard-management" element={<DashboardManagement />} />
          </Route>
          
          {/* Relatorios */}
          <Route path="/dashboard/comunicacao/relatorios" element={<Relatorios />} />
          
          {/* Zeladoria */}
          <Route path="/dashboard/zeladoria/ranking-subs" element={<RankingSubs />} />
          
          {/* Settings */}
          <Route path="/settings/*" element={<Settings />} />
        </Route>
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
