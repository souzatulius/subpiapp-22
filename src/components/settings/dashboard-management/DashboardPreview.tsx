
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { Save, RotateCcw, Smartphone, Monitor } from 'lucide-react';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onDepartmentChange: (department: string) => void;
  onPageTypeChange: (pageType: 'dashboard' | 'communication') => void;
  onViewTypeChange?: (isMobile: boolean) => void;
  isMobilePreview?: boolean;
  onReset?: () => Promise<boolean>;
  onSave?: () => Promise<boolean>;
  isSaving?: boolean;
  onDrop?: (cardData: string) => boolean;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  dashboardType,
  department,
  cards,
  onCardsChange,
  onDepartmentChange,
  onPageTypeChange,
  onViewTypeChange,
  isMobilePreview = false,
  onReset,
  onSave,
  isSaving = false,
  onDrop,
}) => {
  const [isEditMode, setIsEditMode] = useState(true);

  const handleEditCardClick = (card: ActionCardItem) => {
    console.log('Edit card:', card);
    // Here you would open a modal or drawer to edit the card
  };

  const handleDeleteCardClick = (cardId: string) => {
    console.log('Delete card:', cardId);
    const newCards = cards.filter(card => card.id !== cardId);
    onCardsChange(newCards);
  };

  const handleHideCardClick = (cardId: string) => {
    console.log('Hide card:', cardId);
    const newCards = cards.map(card => 
      card.id === cardId 
        ? { ...card, isHidden: true } 
        : card
    );
    onCardsChange(newCards);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const cardData = e.dataTransfer.getData('application/json');
      if (!cardData) return;
      
      if (onDrop && onDrop(cardData)) {
        console.log('Card dropped and added to dashboard');
      }
    } catch (err) {
      console.error('Error handling drop:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="department-select">Coordenação</Label>
              <Select value={department} onValueChange={onDepartmentChange}>
                <SelectTrigger id="department-select" className="w-full">
                  <SelectValue placeholder="Selecione a coordenação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="comunicacao">Comunicação</SelectItem>
                  <SelectItem value="orcamento">Orçamento</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="page-type-select">Tipo de página</Label>
              <Select 
                value={dashboardType} 
                onValueChange={(value) => onPageTypeChange(value as 'dashboard' | 'communication')}
              >
                <SelectTrigger id="page-type-select" className="w-full">
                  <SelectValue placeholder="Selecione o tipo de página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard principal</SelectItem>
                  <SelectItem value="communication">Página de comunicação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-mode" 
                  checked={isEditMode} 
                  onCheckedChange={setIsEditMode} 
                />
                <Label htmlFor="edit-mode">Modo de edição</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="mobile-preview" 
                  checked={isMobilePreview} 
                  onCheckedChange={(checked) => onViewTypeChange && onViewTypeChange(checked)} 
                />
                <Label htmlFor="mobile-preview" className="flex items-center">
                  {isMobilePreview ? (
                    <><Smartphone className="h-4 w-4 mr-1" /> Mobile</>
                  ) : (
                    <><Monitor className="h-4 w-4 mr-1" /> Desktop</>
                  )}
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onReset && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          )}
          
          {onSave && (
            <Button 
              size="sm"
              onClick={onSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          )}
        </div>
      </div>
      
      <Card 
        className="shadow-md bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-4">
          <div className={`relative ${isMobilePreview ? 'max-w-sm mx-auto' : 'w-full'} min-h-[40vh] border border-dashed border-gray-300 rounded-lg p-4 bg-white`}>
            {cards.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center p-4">
                <div>
                  <p className="font-medium">Sem cards no dashboard</p>
                  <p className="text-sm mt-1">Arraste cards da biblioteca para adicionar</p>
                </div>
              </div>
            ) : (
              <UnifiedCardGrid
                cards={cards}
                onCardsChange={onCardsChange}
                onEditCard={handleEditCardClick}
                onDeleteCard={handleDeleteCardClick}
                onHideCard={handleHideCardClick}
                isMobileView={isMobilePreview}
                isEditMode={isEditMode}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPreview;
