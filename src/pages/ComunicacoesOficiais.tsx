
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ComunicacoesOficiaisContent from '@/components/comunicacoes-oficiais/ComunicacoesOficiaisContent';

const ComunicacoesOficiais = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="page-container bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="content-container">
        <DashboardSidebar isOpen={sidebarOpen} />
        <main className="flex-1 w-full overflow-auto p-6">
          <ComunicacoesOficiaisContent />
        </main>
      </div>
    </div>
  );
};

export default ComunicacoesOficiais;
