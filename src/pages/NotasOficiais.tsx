
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import NotasOficiaisContent from '@/components/notas-oficiais/NotasOficiaisContent';

const NotasOficiais = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto p-6">
          <NotasOficiaisContent />
        </main>
      </div>
    </div>
  );
};

export default NotasOficiais;
