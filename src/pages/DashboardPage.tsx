
import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { useDashboardCards } from '@/hooks/dashboard/useDashboardCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import EditModeToggle from '@/components/dashboard/EditModeToggle';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const { cards, isLoading, handleCardEdit, handleCardHide } = useDashboardCards();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (isLoading) {
    return <LoadingIndicator message="Carregando..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto p-6 pb-20 md:pb-6">
            {/* WelcomeCard takes full width */}
            <div className="w-full mb-4">
              <WelcomeCard
                title="Dashboard"
                description="Bem-vindo ao seu dashboard personalizado."
                icon={<Home className="h-6 w-6 mr-2" />}
                color="bg-gradient-to-r from-blue-800 to-blue-950"
                userName={firstName}
              />
            </div>
            
            {/* Edit mode toggle */}
            <div className="flex justify-end mb-6">
              <EditModeToggle isEditMode={isEditMode} onToggle={toggleEditMode} />
            </div>
            
            {/* Card Grid */}
            <CardGridContainer 
              cards={cards.filter(card => !card.isHidden)}
              onCardsChange={setCards => {}}
              onEditCard={handleCardEdit}
              onHideCard={handleCardHide}
              isMobileView={isMobile}
              isEditMode={isEditMode}
            />
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default DashboardPage;
