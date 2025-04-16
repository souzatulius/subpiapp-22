
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Demandas from './pages/Demandas';
import NotasOficiais from './pages/NotasOficiais';

export const Routes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/dashboard/comunicacao" element={<Demandas />} />
      <Route path="/dashboard/comunicacao/notas" element={<NotasOficiais />} />
      <Route path="*" element={<Navigate to="/dashboard/comunicacao" replace />} />
    </RouterRoutes>
  );
};

export default Routes;
