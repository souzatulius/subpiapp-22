
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import RankingDashboard from '@/components/ranking-subprefeituras/RankingDashboard';

const RankingSubprefeituras: React.FC = () => {
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
          <div className="max-w-7xl mx-auto">
            <RankingDashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RankingSubprefeituras;
