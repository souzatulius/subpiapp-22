
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Smartphone, Save, RotateCcw, Library } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { useToast } from '@/components/ui/use-toast';

interface Department {
  id: string;
  nome: string;
  sigla?: string;
}

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  onDepartmentChange: (department: string) => void;
  onViewTypeChange: (isMobile: boolean) => void;
  isMobilePreview: boolean;
  onReset: () => Promise<boolean>;
  onSave: () => Promise<boolean>;
  isSaving?: boolean;
  onCardsChange: (cards: ActionCardItem[]) => void;
  cards: ActionCardItem[];
  onPageTypeChange: (type: 'dashboard' | 'communication') => void;
  onDrop: (cardData: string) => boolean;
  departments: Department[];
  isLoadingDepartments?: boolean;
  showLibraryButton?: boolean;
  onLibraryClick?: () => void;
  isDragOver?: boolean;
  setIsDragOver?: (isDragOver: boolean) => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  dashboardType,
  department,
  onDepartmentChange,
  onViewTypeChange,
  isMobilePreview,
  onReset,
  onSave,
  isSaving = false,
  onCardsChange,
  cards,
  onPageTypeChange,
  onDrop,
  departments = [],
  isLoadingDepartments = false,
  showLibraryButton = false,
  onLibraryClick,
  isDragOver = false,
  setIsDragOver
}) => {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  // Get department display name (show sigla if available, otherwise full name)
  const getDepartmentDisplayName = (dept: Department) => {
    return dept.sigla && dept.sigla.trim() !== '' ? dept.sigla : dept.nome;
  };

  const handleSave = async () => {
    try {
      const result = await onSave();
      if (result) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (e) {
      console.error('Error saving dashboard:', e);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o dashboard',
        variant: 'destructive',
      });
    }
  };

  const handleReset = async () => {
    try {
      await onReset();
    } catch (e) {
      console.error('Error resetting dashboard:', e);
      toast({
        title: 'Erro ao resetar',
        description: 'Não foi possível resetar o dashboard',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // This is crucial for allowing a drop
    e.preventDefault();
    e.stopPropagation();
    
    if (setIsDragOver && !isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (setIsDragOver && isDragOver) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cardData = e.dataTransfer.getData('application/json');
    if (cardData) {
      onDrop(cardData);
    }
    
    if (setIsDragOver) {
      setIsDragOver(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={dashboardType}
            onValueChange={(value) => onPageTypeChange(value as 'dashboard' | 'communication')}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="communication">Comunicação</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={department}
            onValueChange={onDepartmentChange}
            disabled={isLoadingDepartments}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={isLoadingDepartments ? "Carregando..." : "Selecionar coordenação"} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {getDepartmentDisplayName(dept)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-r-none ${!isMobilePreview ? 'bg-blue-50' : ''}`}
              onClick={() => onViewTypeChange(false)}
            >
              <Monitor className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Desktop</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-l-none ${isMobilePreview ? 'bg-blue-50' : ''}`}
              onClick={() => onViewTypeChange(true)}
            >
              <Smartphone className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Mobile</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {showLibraryButton && onLibraryClick && (
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={onLibraryClick}
            >
              <Library className="h-4 w-4" />
              <span>Biblioteca de Cards</span>
            </Button>
          )}

          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Resetar</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Salvando..." : "Salvar"}</span>
          </Button>

          {isSaved && (
            <Badge variant="outline" className="border-green-500 text-green-600 animate-pulse">
              Salvo
            </Badge>
          )}
        </div>
      </div>

      {/* Dashboard Cards Preview with drag and drop support */}
      <div 
        className={`border rounded-lg p-4 transition-all ${
          isMobilePreview 
            ? 'w-[360px] mx-auto' 
            : 'w-full'
        } ${
          isDragOver 
            ? 'border-dashed border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-3 pb-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">
            {dashboardType === 'dashboard' ? 'Preview do Dashboard' : 'Preview da Página de Comunicação'}
            {isMobilePreview && ' (Visualização Mobile)'}
          </h3>
        </div>

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
            <p className="mb-4">
              Nenhum card adicionado. Arraste cards da biblioteca ou use o botão Biblioteca de Cards.
            </p>
            {isDragOver && (
              <div className="text-blue-500 font-medium animate-pulse">
                Solte para adicionar!
              </div>
            )}
          </div>
        ) : (
          <UnifiedCardGrid
            cards={cards}
            onCardsChange={onCardsChange}
            onEditCard={() => {}}
            onDeleteCard={(id) => onCardsChange(cards.filter(card => card.id !== id))}
            onHideCard={(id) => onCardsChange(cards.map(card => 
              card.id === id ? { ...card, isHidden: true } : card
            ))}
            isMobileView={isMobilePreview}
            isEditMode={true}
            disableWiggleEffect
            specialCardsData={{
              overdueCount: 3,
              overdueItems: [
                { title: 'Demanda 1', id: 'd1' },
                { title: 'Demanda 2', id: 'd2' }
              ],
              notesToApprove: 2,
              responsesToDo: 1,
              isLoading: false
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPreview;
