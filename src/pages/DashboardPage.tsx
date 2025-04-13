import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home, RotateCcw } from 'lucide-react';
import { useDashboardCards } from '@/hooks/dashboard/useDashboardCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserData } from '@/hooks/dashboard/useUserData';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import EditCardModal from '@/components/dashboard/card-customization/EditCardModal';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useCardStorage } from '@/hooks/dashboard/useCardStorage';
import PendingTasksCard from '@/components/dashboard/cards/PendingTasksCard';
import ComunicadosCard from '@/components/dashboard/cards/ComunicadosCard';
import NotesApprovalCard from '@/components/dashboard/cards/NotesApprovalCard';
import PendingDemandsCard from '@/components/dashboard/cards/PendingDemandsCard';
import SmartSearchCard from '@/components/dashboard/SmartSearchCard';
const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const isMobile = useIsMobile();
  const {
    user
  } = useAuth();
  const {
    firstName,
    userCoordenaticaoId,
    isLoadingUser
  } = useUserData(user?.id);
  const {
    cards,
    isLoading,
    handleCardEdit: saveCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  } = useDashboardCards();
  const {
    saveCardConfig,
    isSaving
  } = useCardStorage(user, userCoordenaticaoId);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };
  const handleSaveCard = async (updatedCard: Partial<ActionCardItem>) => {
    saveCardEdit(updatedCard as ActionCardItem);
    setIsEditCardModalOpen(false);
    if (user && cards) {
      const updatedCards = cards.map(card => card.id === updatedCard.id ? {
        ...card,
        ...updatedCard
      } : card);
      await saveCardConfig(updatedCards);
    }
  };
  const handleCardsChange = async (updatedCards: ActionCardItem[]) => {
    handleCardsReorder(updatedCards);
    if (user) {
      await saveCardConfig(updatedCards);
    }
  };
  const handleHideCard = async (cardId: string) => {
    handleCardHide(cardId);
    if (user && cards) {
      const updatedCards = cards.map(card => card.id === cardId ? {
        ...card,
        isHidden: true
      } : card);
      await saveCardConfig(updatedCards);
    }
  };
  const handleResetDashboard = async () => {
    resetDashboard();
    if (user) {
      const defaultCards = resetDashboard();
      await saveCardConfig(defaultCards);
    }
    toast({
      title: "Dashboard resetado",
      description: "O dashboard foi restaurado para a configuração padrão.",
      variant: "default"
    });
  };
  const renderSpecialCardContent = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return null;
    if (cardId === 'busca-rapida' || card.isSearch || card.type === 'smart_search') {
      return <SmartSearchCard className="w-full h-full" />;
    }
    if (cardId === 'acoes-pendentes-card' || cardId.includes('acoes-pendentes') || card.isPendingTasks || card.type === 'pending_tasks') {
      return <PendingTasksCard id={card.id} title={card.title} userDepartmentId={userCoordenaticaoId} isComunicacao={userCoordenaticaoId === 'comunicacao'} />;
    }
    if (cardId === 'comunicados-card' || cardId.includes('comunicados') || card.isComunicados || card.type === 'communications') {
      return <ComunicadosCard id={card.id} title={card.title} className="w-full h-full" />;
    }
    if (cardId === 'aprovar-notas' || card.type === 'recent_notes') {
      return <NotesApprovalCard maxNotes={5} />;
    }
    if (cardId === 'responder-demandas' || card.type === 'in_progress_demands') {
      return <PendingDemandsCard maxDemands={5} />;
    }
    return null;
  }, [cards, userCoordenaticaoId]);
  const filteredCards = useMemo(() => {
    return cards ? cards.filter(card => !card.isHidden) : [];
  }, [cards]);
  if (!user) {
    return <LoadingIndicator message="Carregando..." />;
  }
  return <div className="flex flex-col h-screen bg-[#FFFAFA]">
      <Header showControls={true} toggleSidebar={toggleSidebar} className="flex-shrink-0" />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>}
        
        <main className="flex-1 flex flex-col overflow-auto">
          {!isMobile ? <BreadcrumbBar className="flex-shrink-0" /> : <div className="sticky top-0 z-10 bg-white">
              <BreadcrumbBar className="flex-shrink-0" />
            </div>}
          
          <div className="flex-1 overflow-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="max-w-7xl mx-auto p-4 px-[30px]">
              <div className="space-y-6 py-0 my-0 px-0 mx-0">
                <div className="w-full">
                  <WelcomeCard title="Dashboard" description="Arraste e edite os cards para personalizar a sua tela" icon={<Home className="h-8 w-8 mr-2 text-gray-500" />} color="bg-gradient-to-r from-blue-800 to-blue-950" userName={firstName || ''} greeting={true} showResetButton={true} resetButtonIcon={<RotateCcw className="h-4 w-4" />} onResetClick={handleResetDashboard} />
                </div>
                
                <div className={`relative ${isMobile ? 'pb-32' : ''}`}>
                  {isLoading ? <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {Array.from({
                    length: 8
                  }).map((_, index) => <Skeleton key={index} className="h-32 w-full rounded-lg" />)}
                    </div> : filteredCards.length > 0 ? <div className="py-0 px-0">
                      <CardGridContainer cards={filteredCards} onCardsChange={handleCardsChange} onEditCard={handleCardEdit} onHideCard={handleHideCard} isMobileView={isMobile} isEditMode={isEditMode} renderSpecialCardContent={renderSpecialCardContent} disableWiggleEffect={true} showSpecialFeatures={true} />
                    </div> : <div className="p-4 text-center text-gray-500">
                      Nenhum card disponível.
                    </div>}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      
      {selectedCard && <EditCardModal isOpen={isEditCardModalOpen} onClose={() => setIsEditCardModalOpen(false)} onSave={handleSaveCard} card={selectedCard} />}
      
      {isMobile && <MobileBottomNav />}
    </div>;
};
export default DashboardPage;