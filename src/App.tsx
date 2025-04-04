import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './components/AuthCallback';
import { AuthLayout } from './components/AuthLayout';
import DashboardPage from './pages/DashboardPage';
import ReleasesAndNews from './pages/dashboard/comunicacao/ReleasesAndNews';
import CadastrarRelease from './pages/dashboard/comunicacao/CadastrarRelease';
import ListarReleases from './pages/dashboard/comunicacao/ListarReleases';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import DemandasPage from './pages/DemandasPage';
import ConsultarNotas from './pages/ConsultarNotas';
import UsuariosPage from './pages/UsuariosPage';
import RelatoriosPage from './pages/RelatoriosPage';
import RankingSubsPage from './pages/RankingSubsPage';
import AprovarNota from './pages/dashboard/comunicacao/AprovarNota';
import CriarNota from './pages/dashboard/comunicacao/CriarNota';
import CadastrarDemanda from './pages/dashboard/comunicacao/CadastrarDemanda';
import ConsultarDemandas from './pages/dashboard/comunicacao/ConsultarDemandas';
import ConsultarNotasPage from './pages/dashboard/comunicacao/ConsultarNotasPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/*" element={<DashboardPage />}>
          {/* Dashboard Routes */}
          <Route path="comunicacao" element={<Navigate to="/dashboard/comunicacao/comunicacao" replace />} />
          <Route path="comunicacao/comunicacao" element={<Navigate to="/dashboard/comunicacao/releases" replace />} />
          <Route path="comunicacao/releases" element={<ReleasesAndNews />} />
          <Route path="comunicacao/cadastrar-release" element={<CadastrarRelease />} />
          <Route path="comunicacao/listar-releases" element={<ListarReleases />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="demandas" element={<DemandasPage />} />
          <Route path="notas" element={<ConsultarNotas />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="relatorios" element={<RelatoriosPage />} />
          <Route path="ranking-subs" element={<RankingSubsPage />} />
          <Route path="comunicacao/aprovar-nota" element={<AprovarNota />} />
          <Route path="comunicacao/criar-nota" element={<CriarNota />} />
          <Route path="comunicacao/cadastrar-demanda" element={<CadastrarDemanda />} />
          <Route path="comunicacao/consultar-demandas" element={<ConsultarDemandas />} />
          <Route path="comunicacao/consultar-notas" element={<ConsultarNotasPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
