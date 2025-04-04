// src/pages/dashboard/comunicacao/Comunicacao.tsx
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/dashboard/useUserData';
import EditCardModal from '@/components/dashboard/EditCardModal';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { Skeleton } from '@/components/ui/skeleton';
import useUserDashboardCards from '@/hooks/dashboard/useUserDashboardCards';

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

  // Usa o hook unificado passando o departamento "comunicacao"
  const {
    cards,
    isLoading,
    isEditMode,
    toggleEditMode,
    handleCardEdit,
    handleCardHide,
    updateCardsOrder,
    isEditModalOpen,
    selectedCard,
    handleSaveCardEdit,
    setIsEditModalOpen
  } = useUserDashboardCards(user, department, isPreview);

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-4 mx-auto max-w-7xl p-4 md:p-6">
      <div className="w-full">
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
          userName={firstName}
        />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        cards.length > 0 ? (
          <CardGridContainer
            cards={cards.filter(card => !card.isHidden)}
            onCardsChange={updateCardsOrder}
            onEditCard={handleCardEdit}
            onHideCard={handleCardHide}
            isMobileView={isMobile}
            isEditMode={isEditMode}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
            Nenhum card disponível.
          </div>
        )
      )}
      {selectedCard && (
        <EditCardModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCardEdit}
          card={selectedCard}
        />
      )}
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
