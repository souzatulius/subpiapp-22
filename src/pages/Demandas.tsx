
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Layout } from '@/components/demandas';
import DemandasContent from '@/components/demandas/DemandasContent';

const Demandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden px-0">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} />

        {/* Main content */}
        <Layout>
          <DemandasContent />
        </Layout>
      </div>
    </div>
  );
};

export default Demandas;
