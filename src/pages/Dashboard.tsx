
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/hooks/dashboard/useUserData';
import { BarChart3 } from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useDashboardCards } from '@/hooks/dashboard/useDashboardCards';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { firstName } = useUserData(user?.id);
  const isMobile = useIsMobile();
  
  const {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder
  } = useDashboardCards(user);

  if (!user) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      <div className="w-full mb-2">
        <WelcomeCard
          title="Dashboard"
          description="Acesse as principais funcionalidades do sistema"
          icon={<BarChart3 className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-600 to-blue-800"
          userName={firstName}
          greeting={true}
        />
      </div>
      
      <WelcomeMessage />
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg col-span-1"></div>
            <div className="h-32 bg-gray-200 rounded-lg col-span-1"></div>
            <div className="h-32 bg-gray-200 rounded-lg col-span-1"></div>
            <div className="h-32 bg-gray-200 rounded-lg col-span-1"></div>
          </div>
        </div>
      ) : (
        <>
          <CardGridContainer
            cards={cards}
            onCardsChange={handleCardsReorder}
            onEditCard={handleCardEdit}
            onHideCard={handleCardHide}
            isMobileView={isMobile}
            isEditMode={isEditMode}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
