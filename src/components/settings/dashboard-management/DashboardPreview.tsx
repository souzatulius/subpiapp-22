
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Smartphone, Monitor, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments } from '@/hooks/dashboard-management/useDepartments';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  isMobilePreview?: boolean;
  onAddCard?: (card: ActionCardItem) => void;
  onDepartmentChange?: (department: string) => void;
  onViewTypeChange?: (isMobile: boolean) => void;
  onReset?: () => Promise<boolean>;
  onSave?: () => Promise<boolean>;
  isSaving?: boolean;
  onCardsChange?: (cards: ActionCardItem[]) => void;
  cards?: ActionCardItem[];
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
  isMobilePreview = false,
  onAddCard,
  onDepartmentChange,
  onViewTypeChange,
  onReset,
  onSave,
  isSaving = false,
  onCardsChange,
  cards: externalCards
}) => {
  const {
    cards: internalCards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard: internalDeleteCard,
    handleHideCard: internalHideCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    isLoading: isLoadingInternal,
    configSource
  } = useDefaultDashboardState(department, dashboardType === 'dashboard' ? 'dashboard' : 'communication');

  const cards = externalCards || internalCards;
  const isLoading = isLoadingInternal && !externalCards;

  const handleCardsChange = (updatedCards: ActionCardItem[]) => {
    if (onCardsChange) {
      onCardsChange(updatedCards);
    } else {
      setCards(updatedCards);
    }
  };

  // Enhanced handlers with proper logging and error handling
  const handleDeleteCard = (id: string) => {
    console.log(`Deleting card with ID: ${id}`);
    try {
      const updatedCards = cards.filter(card => card.id !== id);
      console.log(`Cards before deletion: ${cards.length}, after: ${updatedCards.length}`);
      handleCardsChange(updatedCards);
      
      // Show confirmation toast
      toast({
        title: "Card removido",
        description: "O card foi removido com sucesso do dashboard",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({
        title: "Erro ao remover card",
        description: "Não foi possível remover o card. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleHideCard = (id: string) => {
    console.log(`Hiding card with ID: ${id}`);
    try {
      const updatedCards = cards.map(card => 
        card.id === id ? { ...card, isHidden: true } : card
      );
      handleCardsChange(updatedCards);
      
      // Show confirmation toast
      toast({
        title: "Card ocultado",
        description: "O card foi ocultado do dashboard",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Error hiding card:', error);
      toast({
        title: "Erro ao ocultar card",
        description: "Não foi possível ocultar o card. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { departments } = useDepartments();

  const [selectedPageType, setSelectedPageType] = useState<'inicial' | 'comunicacao'>(
    dashboardType === 'dashboard' ? 'inicial' : 'comunicacao'
  );
  
  useEffect(() => {
    if (dashboardType === 'dashboard' && selectedPageType !== 'inicial') {
      setSelectedPageType('inicial');
    } else if (dashboardType === 'communication' && selectedPageType !== 'comunicacao') {
      setSelectedPageType('comunicacao');
    }
  }, [dashboardType]);
  
  const [mockData, setMockData] = useState({
    kpis: {
      pressRequests: {
        today: 14,
        yesterday: 12,
        percentageChange: 16.7,
        loading: false
      },
      pendingApproval: {
        total: 8,
        awaitingResponse: 5,
        loading: false
      },
      notesProduced: {
        total: 42,
        approved: 38,
        rejected: 4,
        loading: false
      }
    },
    lists: {
      recentDemands: {
        items: [
          { id: 'dem-1', title: 'Demanda de exemplo 1', status: 'in-progress' as const, date: '2023-12-01', path: '#' },
          { id: 'dem-2', title: 'Demanda de exemplo 2', status: 'pending' as const, date: '2023-12-02', path: '#' }
        ],
        loading: false
      },
      recentNotes: {
        items: [
          { id: 'note-1', title: 'Nota de exemplo 1', status: 'approved' as const, date: '2023-12-01', path: '#' },
          { id: 'note-2', title: 'Nota de exemplo 2', status: 'pending' as const, date: '2023-12-02', path: '#' }
        ],
        loading: false
      }
    },
    originOptions: [
      { id: 'origin-1', title: 'Imprensa', icon: '📰' },
      { id: 'origin-2', title: 'Ministério', icon: '🏛️' },
      { id: 'origin-3', title: 'Interno', icon: '🏢' }
    ]
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      const cardType = e.dataTransfer.getData('card/type');
      
      if (cardData && cardData.id) {
        const existingCard = cards.find(c => c.title === cardData.title);
        if (existingCard) {
          return;
        }
        
        const newCard: ActionCardItem = {
          ...cardData,
          id: `card-${uuidv4()}`,
          isCustom: false
        };
        
        if (cardType === 'dynamic' && cardData.type) {
          newCard.type = cardData.type;
        }
        
        const updatedCards = [...cards, newCard];
        handleCardsChange(updatedCards);
        
        if (onAddCard) {
          onAddCard(newCard);
        }
      }
    } catch (error) {
      console.error('Error parsing dropped card data:', error);
    }
  };

  const handleViewChange = (isMobile: boolean) => {
    if (onViewTypeChange) {
      onViewTypeChange(isMobile);
    }
  };

  const handleDepartmentSelect = (value: string) => {
    if (onDepartmentChange) {
      onDepartmentChange(value);
    }
  };

  const handlePageTypeSelect = (value: string) => {
    if (value === 'inicial' || value === 'comunicacao') {
      setSelectedPageType(value);
      const newViewType = value === 'inicial' ? 'dashboard' : 'communication';
      
      console.log(`Changing page type to ${value}, viewType: ${newViewType}`);
      
      if (value === 'inicial' && dashboardType !== 'dashboard') {
        if (onDepartmentChange) {
          onDepartmentChange('dashboard');
        }
      } else if (value === 'comunicacao' && dashboardType !== 'communication') {
        if (onDepartmentChange) {
          onDepartmentChange('communication');
        }
      }
    }
  };

  const handleManualSave = async () => {
    if (onSave) {
      return onSave();
    }
    
    try {
      const viewTypeToSave = selectedPageType === 'inicial' ? 'dashboard' : 'communication';
      
      console.log(`Saving dashboard config for department: ${department}, view type: ${viewTypeToSave}`);
      
      const { data: existingConfig, error: checkError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', department)
        .eq('view_type', viewTypeToSave)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing dashboard config:', checkError);
        toast({
          title: "Erro ao verificar dashboard",
          description: "Não foi possível verificar a configuração existente",
          variant: "destructive"
        });
        return false;
      }

      const cardsJson = JSON.stringify(cards);

      if (existingConfig) {
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({ cards_config: cardsJson })
          .eq('id', existingConfig.id);

        if (updateError) {
          console.error('Error updating dashboard config:', updateError);
          toast({
            title: "Erro ao salvar dashboard",
            description: "Não foi possível salvar a configuração do dashboard",
            variant: "destructive"
          });
          return false;
        }
      } else {
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: department,
            view_type: viewTypeToSave,
            cards_config: cardsJson
          });

        if (insertError) {
          console.error('Error inserting dashboard config:', insertError);
          toast({
            title: "Erro ao criar dashboard",
            description: "Não foi possível criar a configuração do dashboard",
            variant: "destructive"
          });
          return false;
        }
      }
      
      toast({
        title: "Dashboard salvo",
        description: "Configuração do dashboard salva com sucesso",
        variant: "success"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a configuração",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 flex-grow">
          <Select value={department} onValueChange={handleDepartmentSelect}>
            <SelectTrigger className="w-[200px] h-9 text-sm">
              <SelectValue placeholder="Selecione a coordenação" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.sigla || dept.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPageType} onValueChange={handlePageTypeSelect}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Tipo de Página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inicial">Inicial</SelectItem>
              <SelectItem value="comunicacao">Comunicação</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewChange(!isMobilePreview)}
            className="h-9"
          >
            {isMobilePreview ? (
              <><Smartphone className="h-4 w-4 mr-1" /> Mobile</>
            ) : (
              <><Monitor className="h-4 w-4 mr-1" /> Desktop</>
            )}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={configSource === 'default' ? 'secondary' : 'success'} className="cursor-help">
                  <Info className="h-3 w-3 mr-1" /> {configSource === 'custom' ? 'Personalizado' : 'Padrão'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-md bg-black/90 text-white p-3">
                <div className="space-y-2 text-xs">
                  <p><strong>Tipo de Página:</strong> {selectedPageType}</p>
                  <p><strong>Tipo de Dashboard:</strong> {dashboardType}</p>
                  <p><strong>ID Departamento:</strong> {department}</p>
                  <p><strong>Salvando em:</strong> tabela department_dashboards</p>
                  <p><strong>Tipo de Visualização:</strong> {selectedPageType === 'inicial' ? 'dashboard' : 'communication'}</p>
                  <p className="text-yellow-300 font-medium">Certifique-se de que o tipo de página corresponde ao dashboard que deseja personalizar!</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-9"
            >
              Resetar
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            onClick={handleManualSave}
            disabled={isSaving}
            className="h-9"
          >
            {isSaving ? (
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...</>
            ) : (
              <>Salvar</>
            )}
          </Button>
        </div>
      </div>
      
      <div 
        className={`p-4 transition-all duration-300 ${isDraggingOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`p-4 bg-gray-100 rounded-lg min-h-[400px] ${isDraggingOver ? 'opacity-70' : ''}`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-gray-600">Carregando configuração do dashboard...</p>
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center p-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              {isDraggingOver ? 
                "Solte aqui para adicionar o card ao dashboard" : 
                "Nenhum card configurado. Arraste cards para este espaço para começar a personalizar o dashboard."
              }
            </div>
          ) : (
            <UnifiedCardGrid 
              cards={cards}
              onCardsChange={handleCardsChange}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onHideCard={handleHideCard}
              isMobileView={isMobilePreview}
              isEditMode={true}
              showSpecialFeatures={true}
              quickDemandTitle={newDemandTitle}
              onQuickDemandTitleChange={setNewDemandTitle}
              onQuickDemandSubmit={handleQuickDemandSubmit}
              onSearchSubmit={handleSearchSubmit}
              specialCardsData={{
                ...specialCardsData,
                ...mockData
              }}
            />
          )}
        </div>
      </div>
      
      {isDraggingOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 bg-opacity-20 text-blue-800 font-semibold p-4 rounded-lg shadow-lg">
            Solte para adicionar ao dashboard
          </div>
        </div>
      )}
      
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default DashboardPreview;
