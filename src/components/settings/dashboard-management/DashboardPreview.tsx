
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments } from '@/hooks/dashboard-management/useDepartments';

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
  isSaving = false
}) => {
  const {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleHideCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    isLoading
  } = useDefaultDashboardState(department);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { departments } = useDepartments();

  const [selectedPageType, setSelectedPageType] = useState<'inicial' | 'comunicacao'>(
    dashboardType === 'dashboard' ? 'inicial' : 'comunicacao'
  );
  
  // Effect to sync the page type with dashboardType
  useEffect(() => {
    if (dashboardType === 'dashboard' && selectedPageType !== 'inicial') {
      setSelectedPageType('inicial');
    } else if (dashboardType === 'communication' && selectedPageType !== 'comunicacao') {
      setSelectedPageType('comunicacao');
    }
  }, [dashboardType]);
  
  // Mock data for dynamic cards in preview
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

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      const cardType = e.dataTransfer.getData('card/type');
      
      if (cardData && cardData.id) {
        // Check if we already have this card (by title)
        const existingCard = cards.find(c => c.title === cardData.title);
        if (existingCard) {
          // Silently skip adding duplicate cards
          return;
        }
        
        // Create a new card with a unique ID based on the dropped card
        const newCard: ActionCardItem = {
          ...cardData,
          id: `card-${uuidv4()}`, // Generate a new unique ID
          isCustom: false // Mark as not custom to prevent deletion
        };
        
        // Preserve the dynamic card type from the dragged item
        if (cardType === 'dynamic' && cardData.type) {
          newCard.type = cardData.type;
        }
        
        setCards([...cards, newCard]);
        
        // Notify parent component if callback exists
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

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border">
        {/* Department selection */}
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
        </div>
        
        {/* Save/Reset buttons */}
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
          
          {onSave && (
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="h-9"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...</>
              ) : (
                <>Salvar</>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Dashboard preview area */}
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
              onCardsChange={setCards}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onHideCard={handleHideCard}
              isMobileView={isMobilePreview}
              isEditMode={true}
              // Enable special features
              showSpecialFeatures={true}
              quickDemandTitle={newDemandTitle}
              onQuickDemandTitleChange={setNewDemandTitle}
              onQuickDemandSubmit={handleQuickDemandSubmit}
              onSearchSubmit={handleSearchSubmit}
              specialCardsData={{
                ...specialCardsData,
                ...mockData // Add mock data for dynamic card previews
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
