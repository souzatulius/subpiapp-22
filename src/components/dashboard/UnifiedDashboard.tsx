
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Home } from 'lucide-react';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import HiddenCardsTray from './HiddenCardsTray';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnifiedDashboardProps {
  userId: string;
  dashboardType: 'dashboard' | 'communication';
  title?: string;
  description?: string;
  headerComponent?: React.ReactNode;
  fallbackCards?: ActionCardItem[];
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  userId,
  dashboardType,
  title = 'Dashboard',
  description = 'Personalize seu dashboard movendo ou ocultando os cards.',
  headerComponent,
  fallbackCards = []
}) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [specialCardsData, setSpecialCardsData] = useState({
    overdueCount: 0,
    overdueItems: [] as { title: string; id: string }[],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  });
  const isMobile = useIsMobile();

  // Fetch cards for the user
  useEffect(() => {
    const fetchUserDashboard = async () => {
      if (!userId) return;
      setIsLoading(true);

      try {
        // First get user's department
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id, nome_completo')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
          // Use fallback cards if we can't get user data
          setCards(fallbackCards);
          setIsLoading(false);
          return;
        }
        
        setUserDepartment(userData.coordenacao_id);
        
        // Try to get user's custom dashboard
        const { data: userDashboard, error: dashboardError } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', userId)
          .eq('dashboard_type', dashboardType)
          .single();
          
        if (!dashboardError && userDashboard?.cards_config) {
          try {
            let parsedCards = JSON.parse(userDashboard.cards_config);
            // Ensure all cards have version
            parsedCards = parsedCards.map((card: ActionCardItem) => ({
              ...card,
              version: card.version || '1.0'
            }));
            setCards(parsedCards);
            setIsLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing user dashboard:', parseError);
          }
        }
        
        // If no user dashboard, try department dashboard
        if (userData.coordenacao_id) {
          const { data: deptDashboard, error: deptError } = await supabase
            .from('department_dashboards')
            .select('cards_config')
            .eq('department', userData.coordenacao_id)
            .eq('view_type', dashboardType)
            .single();
            
          if (!deptError && deptDashboard?.cards_config) {
            try {
              let parsedCards = JSON.parse(deptDashboard.cards_config);
              // Ensure all cards have version
              parsedCards = parsedCards.map((card: ActionCardItem) => ({
                ...card,
                version: card.version || '1.0'
              }));
              setCards(parsedCards);
              setIsLoading(false);
              return;
            } catch (parseError) {
              console.error('Error parsing department dashboard:', parseError);
            }
          }
        }
        
        // Finally, use fallback
        setCards(fallbackCards);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        // Use fallback cards if everything fails
        setCards(fallbackCards);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserDashboard();
  }, [userId, dashboardType, fallbackCards]);
  
  // Save the dashboard configuration
  const saveDashboard = async () => {
    if (!userId) return;
    
    try {
      const { data, error: checkError } = await supabase
        .from('user_dashboard')
        .select('id')
        .eq('user_id', userId)
        .eq('dashboard_type', dashboardType)
        .single();
        
      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(cards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('dashboard_type', dashboardType);
          
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_dashboard')
          .insert({
            user_id: userId,
            dashboard_type: dashboardType,
            cards_config: JSON.stringify(cards)
          });
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Dashboard salvo",
        description: "Suas alterações foram salvas com sucesso.",
        variant: "success"
      });
      
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Card manipulation functions
  const handleCardsChange = (newCards: ActionCardItem[]) => {
    setCards(newCards);
  };
  
  const handleDeleteCard = (id: string) => {
    // Instead of deleting, mark as hidden
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, hidden: true } : card
    ));
    
    toast({
      title: "Card ocultado",
      description: "O card foi ocultado do dashboard. Você pode restaurá-lo a qualquer momento.",
      variant: "default"
    });
  };
  
  const handleEditCard = (card: ActionCardItem) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };
  
  const handleShowCard = (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, hidden: false } : card
    ));
  };
  
  const handleSaveCard = (data: any) => {
    if (editingCard) {
      // Update existing card
      setCards(prev => prev.map(card => 
        card.id === editingCard.id 
          ? { 
              ...card, 
              title: data.title,
              iconId: data.iconId || editingCard.iconId,
              color: data.color,
              path: data.path,
              width: data.width,
              height: data.height,
              displayMobile: data.displayMobile
            } 
          : card
      ));
    }
    
    setEditingCard(null);
    setIsModalOpen(false);
  };
  
  // Filter out hidden cards for display
  const visibleCards = cards.filter(card => !card.hidden);
  const hiddenCards = cards.filter(card => card.hidden);
  
  // Always ensure at least one card (fallback)
  const displayCards = visibleCards.length ? visibleCards : [{
    id: 'welcome-fallback',
    title: 'Bem-vindo',
    iconId: 'home',
    path: '/dashboard',
    color: 'blue',
    width: '100',
    height: '2',
    type: 'standard',
    displayMobile: true,
    mobileOrder: 1,
    version: '1.0'
  }];

  return (
    <div className="space-y-4">
      {headerComponent ? (
        headerComponent
      ) : (
        <WelcomeCard
          title={title}
          description={description}
          icon={<Home className="h-6 w-6 mr-2" />}
          showButton={true}
          buttonText={isEditMode ? "Salvar" : "Editar Dashboard"}
          onButtonClick={isEditMode ? saveDashboard : () => setIsEditMode(true)}
          secondaryButtonText={isEditMode ? "Cancelar" : undefined}
          onSecondaryButtonClick={isEditMode ? () => setIsEditMode(false) : undefined}
          color="bg-gradient-to-r from-blue-800 to-blue-950"
        />
      )}
      
      {/* Hidden cards tray */}
      {isEditMode && hiddenCards.length > 0 && (
        <HiddenCardsTray 
          hiddenCards={hiddenCards} 
          onShowCard={handleShowCard} 
        />
      )}
      
      {/* Cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
          <div className="text-gray-500">Carregando dashboard...</div>
        </div>
      ) : (
        <UnifiedCardGrid
          cards={displayCards}
          onCardsChange={handleCardsChange}
          onEditCard={isEditMode ? handleEditCard : undefined}
          onDeleteCard={isEditMode ? handleDeleteCard : undefined}
          isMobileView={isMobile}
          isEditMode={isEditMode}
          disableWiggleEffect={!isEditMode}
        />
      )}
      
      {/* Card customization modal */}
      <CardCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default UnifiedDashboard;
