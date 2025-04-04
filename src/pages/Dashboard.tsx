
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { LayoutDashboard, Loader2, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/dashboard/useUserData';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { useBadgeValues } from '@/hooks/dashboard/useBadgeValues';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

interface DashboardProps {
  isPreview?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isPreview = false }) => {
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const isMobile = useIsMobile();
  const [isEditMode, setIsEditMode] = useState(false);
  const { 
    actionCards, 
    setActionCards, 
    isLoadingDashboard
  } = useDashboardConfig();

  useEffect(() => {
    const fetchUserDashboardConfig = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data && data.cards_config) {
          setActionCards(JSON.parse(data.cards_config));
        }
      } catch (error) {
        console.error('Error fetching user dashboard config:', error);
      }
    };

    fetchUserDashboardConfig();
  }, [user, setActionCards]);

  const handleCardEdit = (card: ActionCardItem) => {
    toast({
      title: "Edição de Card",
      description: "Função de edição será implementada em breve.",
      variant: "default",
    });
  };

  const handleCardHide = async (card: ActionCardItem) => {
    if (!card.id) return;
    
    const updatedCards = actionCards.map(c => 
      c.id === card.id ? { ...c, isHidden: true } : c
    );
    
    setActionCards(updatedCards);
    
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          await supabase
            .from('user_dashboard')
            .update({ 
              cards_config: JSON.stringify(updatedCards),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_dashboard')
            .insert({ 
              user_id: user.id,
              cards_config: JSON.stringify(updatedCards),
              department_id: null
            });
        }
        
        toast({
          title: "Card ocultado",
          description: "O card foi ocultado do painel. Você pode restaurá-lo nas configurações.",
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao ocultar card:', error);
        
        setActionCards(actionCards);
        
        toast({
          title: "Erro",
          description: "Não foi possível ocultar o card. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Card ocultado",
        description: "O card foi ocultado temporariamente. Faça login para salvar suas configurações.",
        variant: "default",
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (isLoadingDashboard || (!isPreview && !user)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <span className="text-blue-600 font-medium text-lg">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Full width WelcomeCard */}
      <div className="w-full">
        <WelcomeCard
          title="Dashboard"
          description="Acompanhe e gerencie todas as atividades do sistema"
          icon={<LayoutDashboard className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-600 to-blue-800"
          userName={firstName}
        />
      </div>
      
      {/* Edit mode toggle button as an icon only */}
      <div className="flex justify-end">
        <Button 
          onClick={toggleEditMode}
          variant="ghost"
          size="icon"
          className={`${
            isEditMode 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={isEditMode ? 'Concluir edição' : 'Personalizar dashboard'}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <WelcomeMessage />
      
      <div className="mt-2">
        <UnifiedCardGrid
          cards={actionCards}
          onCardsChange={setActionCards}
          onEditCard={handleCardEdit}
          onHideCard={handleCardHide}
          isMobileView={isMobile}
          isEditMode={isEditMode}
          specialCardsData={{}}
        />
      </div>
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Dashboard;
