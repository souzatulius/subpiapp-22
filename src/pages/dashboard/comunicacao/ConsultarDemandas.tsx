
import React from 'react';
import ConsultarDemandasContent from '@/components/consultar-demandas/ConsultarDemandasContent';
import AdminProtectedRoute from '@/components/layouts/AdminProtectedRoute';

const ConsultarDemandas = () => {
  return (
    <AdminProtectedRoute>
      <div className="max-w-7xl mx-auto p-4">
        <ConsultarDemandasContent />
      </div>
    </AdminProtectedRoute>
  );
};

export default ConsultarDemandas;
