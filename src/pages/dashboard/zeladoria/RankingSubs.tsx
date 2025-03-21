
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import RankingContent from '@/components/ranking/RankingContent';
import BackButton from '@/components/layouts/BackButton';

const RankingSubs = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <BackButton destination="/dashboard" />
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Ranking das Subs</h1>
            <RankingContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RankingSubs;
