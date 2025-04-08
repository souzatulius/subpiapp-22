
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ESICWelcomeCard from '@/components/esic/ESICWelcomeCard';
import ProcessoList from '@/components/esic/ProcessoList';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import ESICSearchHeader from '@/components/esic/ESICSearchHeader';

const ESICPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNewProcessClick = () => {
    navigate('/esic/create');
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      {isMobile && (
        <div className="bg-white">
          <BreadcrumbBar />
        </div>
      )}
      
      <div className="flex flex-1 relative">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 w-full">
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-7xl mx-auto">
            <div className={`p-4 ${isMobile ? 'pb-32' : ''}`}>
              <ESICWelcomeCard />
              
              <div className="mt-6">
                <ESICSearchHeader 
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onFilterClick={handleFilterClick}
                  onNewProcessClick={handleNewProcessClick}
                />
                
                <div className="mt-4">
                  <ProcessoList 
                    viewMode={viewMode}
                    searchTerm={searchTerm}
                    filterOpen={filterOpen}
                    setFilterOpen={setFilterOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ESICPage;
