
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2 } from 'lucide-react';
import NewRequestOriginCard from '@/components/comunicacao/NewRequestOriginCard';
import PendingDemandsCard from '@/components/comunicacao/PendingDemandsCard';
import NotasManagementCard from '@/components/comunicacao/NotasManagementCard';
import DemandasEmAndamentoCard from '@/components/comunicacao/DemandasEmAndamentoCard';
import ActionCards from '@/components/comunicacao/ActionCards';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useState as useReactState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { toast } from '@/hooks/use-toast';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(department);
  const [isComunicacao, setIsComunicacao] = useState<boolean>(department === 'comunicacao');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [departmentName, setDepartmentName] = useState<string>('');
  const isMobile = useIsMobile();
  
  // Use the dashboard config hook to get the dashboard configuration
  const { config: dashboardCards, isLoading: isLoadingConfig, saveConfig } = useDefaultDashboardConfig(
    isPreview ? department : userDepartment || ''
  );

  // Add state for the card editing modal
  const [isEditModalOpen, setIsEditModalOpen] = useReactState(false);
  const [editingCard, setEditingCard] = useReactState<ActionCardItem | null>(null);
  const [allCards, setAllCards] = useReactState<ActionCardItem[]>([]);

  useEffect(() => {
    if (dashboardCards && dashboardCards.length > 0) {
      setAllCards(dashboardCards);
    }
  }, [dashboardCards]);

  useEffect(() => {
    if (isPreview) {
      // In preview mode, use the department provided as prop
      setUserDepartment(department);
      setIsComunicacao(department === 'comunicacao');
      fetchDepartmentName(department);
      setIsLoading(false);
      return;
    }

    // If not in preview mode, fetch the user's actual department
    async function fetchUserDepartment() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user department:', error);
          return;
        }
        
        if (data) {
          setUserDepartment(data.coordenacao_id);
          
          // Check if user is from Comunicacao
          const { data: coordData, error: coordError } = await supabase
            .from('coordenacoes')
            .select('descricao')
            .eq('id', data.coordenacao_id)
            .single();
          
          if (coordError) {
            console.error('Error fetching coordination info:', coordError);
          } else if (coordData) {
            setIsComunicacao(
              coordData.descricao.toLowerCase().includes('comunica') || 
              data.coordenacao_id === 'comunicacao'
            );
            setDepartmentName(coordData.descricao);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user department:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDepartment();
  }, [user, isPreview, department]);

  const fetchDepartmentName = async (deptId: string) => {
    if (deptId && deptId !== 'default') {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('descricao')
          .eq('id', deptId)
          .single();
          
        if (error) {
          console.error('Error fetching department name:', error);
        } else if (data) {
          setDepartmentName(data.descricao);
        }
      } catch (err) {
        console.error('Failed to fetch department name:', err);
      }
    } else {
      setDepartmentName(deptId === 'default' ? 'Padrão (Todos)' : '');
    }
  };

  // Handle card editing
  const handleEditCard = (card: ActionCardItem) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  // Handle card hiding
  const handleHideCard = (cardId: string) => {
    const updatedCards = allCards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    setAllCards(updatedCards);
    
    // Save changes if not in preview mode
    if (!isPreview && userDepartment) {
      saveConfig(updatedCards, userDepartment);
      toast({
        title: "Card ocultado",
        description: "O card foi ocultado do dashboard",
        variant: "success"
      });
    }
  };

  // Handle card save
  const handleSaveCard = (cardData: any) => {
    if (editingCard) {
      // For special cards, only allow title and color changes
      const isSpecialCard = editingCard.isQuickDemand || 
                           editingCard.isSearch || 
                           editingCard.isOverdueDemands || 
                           editingCard.isPendingActions;
      
      const updatedCards = allCards.map(card =>
        card.id === editingCard.id 
          ? { 
              ...card,
              // Only update title and color for special cards
              title: cardData.title || card.title,
              color: cardData.color || card.color,
              // Update other properties only for regular cards
              ...(isSpecialCard ? {} : {
                subtitle: cardData.subtitle,
                path: cardData.path || card.path,
                iconId: cardData.iconId || card.iconId,
                width: cardData.width || card.width,
                height: cardData.height || card.height
              })
            } 
          : card
      );
      
      setAllCards(updatedCards);
      
      // Save changes if not in preview mode
      if (!isPreview && userDepartment) {
        saveConfig(updatedCards, userDepartment);
        toast({
          title: "Card atualizado",
          description: "O card foi atualizado com sucesso",
          variant: "success"
        });
      }
    }
    
    setIsEditModalOpen(false);
    setEditingCard(null);
  };

  // Handle cards reordering
  const handleCardsChange = (newCards: ActionCardItem[]) => {
    setAllCards(newCards);
    
    // Save changes if not in preview mode
    if (!isPreview && userDepartment) {
      saveConfig(newCards, userDepartment);
    }
  };

  if (isLoading || isLoadingConfig) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Carregando dashboard...</span>
      </div>
    );
  }

  // Get the special cards data for integration with the UnifiedCardGrid
  const specialCardsData = {
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 pb-20 md:pb-6">
      {/* Welcome Card - Fixed */}
      <WelcomeCard
        title="Comunicação"
        description="Gerencie demandas e notas oficiais"
        icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />
      
      {/* Action Cards - Customizable through dashboard management */}
      <div>
        {isPreview || !allCards || allCards.length === 0 ? (
          <ActionCards 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao"
            isEditMode={isPreview}
          />
        ) : (
          <UnifiedCardGrid
            cards={allCards}
            onCardsChange={handleCardsChange}
            onEditCard={handleEditCard}
            onDeleteCard={() => {}} // Not allowing card deletion
            onHideCard={handleHideCard}
            isMobileView={isMobile}
            isEditMode={true}
            showSpecialFeatures={true}
            specialCardsData={specialCardsData}
          />
        )}
      </div>
      
      {/* Dynamic Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Nova Solicitação - only for Comunicação */}
        {isComunicacao && (
          <div className="col-span-1 md:col-span-1">
            <NewRequestOriginCard baseUrl="dashboard/comunicacao" />
          </div>
        )}
        
        {/* Card 2: Responder Demandas - for all */}
        <div className="col-span-1 md:col-span-1">
          <PendingDemandsCard 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao"
          />
        </div>
        
        {/* Card 3: Gerenciamento de Notas - for all */}
        <div className="col-span-1 md:col-span-1">
          <NotasManagementCard 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao/notas"
          />
        </div>
        
        {/* Card 4: Demandas em Andamento - for all */}
        <div className={`col-span-1 md:col-span-${isComunicacao ? 3 : 1}`}>
          <DemandasEmAndamentoCard 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao" 
          />
        </div>
      </div>
      
      {/* Card Customization Modal for editing cards */}
      <CardCustomizationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard}
        limitToBasicEditing={editingCard?.isQuickDemand || 
                             editingCard?.isSearch || 
                             editingCard?.isOverdueDemands || 
                             editingCard?.isPendingActions}
      />
      
      {/* Only add MobileBottomNav if this page is not in preview mode */}
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
