
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/dashboard/useUserData';
import EditCardModal from '@/components/dashboard/EditCardModal';
import EditModeToggle from '@/components/dashboard/EditModeToggle';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { useComunicacaoDashboard } from '@/hooks/dashboard/useComunicacaoDashboard';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const isMobile = useIsMobile();
  
  const {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen
  } = useComunicacaoDashboard(user, isPreview, department);

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-4">
      <div className="w-full">
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
      </div>
      
      <EditModeToggle isEditMode={isEditMode} onToggle={toggleEditMode} />
      
      <CardGridContainer
        cards={cards}
        onCardsChange={cards => cards}
        onEditCard={handleCardEdit}
        onHideCard={handleCardHide}
        isMobileView={isMobile}
        isEditMode={isEditMode}
      />
      
      <EditCardModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCardEdit}
        card={selectedCard}
      />
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
