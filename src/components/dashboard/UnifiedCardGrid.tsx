
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import CardGrid from '@/components/dashboard/CardGrid';
import { ActionCardItem } from '@/types/dashboard';
import WelcomeCard from '@/components/shared/WelcomeCard';

interface UnifiedCardGridProps {
  cards: ActionCardItem[];
  setCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>;
  loading: boolean;
  handleDeleteCard: (id: string) => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleAddNewCard?: () => void;
  saveDashboard?: () => Promise<boolean>;
  isEditMode?: boolean;
  setIsEditMode?: (value: boolean) => void;
}

const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards,
  setCards,
  loading,
  handleDeleteCard,
  handleEditCard,
  handleAddNewCard,
  saveDashboard,
  isEditMode = false,
  setIsEditMode = () => {},
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (saveDashboard) {
        const success = await saveDashboard();
        if (success) {
          setIsEditMode(false);
          toast({
            title: 'Dashboard salvo!',
            description: 'Suas alterações foram salvas com sucesso.',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao salvar dashboard:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um problema ao salvar suas alterações. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEditMode = () => {
    if (isEditMode && saveDashboard) {
      handleSave();
    } else {
      setIsEditMode(true);
    }
  };

  // Separar Welcome Cards dos cards normais
  const welcomeCards = cards.filter(card => card.type === 'welcome_card');
  const standardCards = cards.filter(card => card.type !== 'welcome_card');

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isDesktop && saveDashboard && (
        <div className="flex justify-end items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-2"
          >
            <Button
              variant={isEditMode ? "default" : "outline"}
              onClick={handleToggleEditMode}
              disabled={isSaving}
              className="gap-1"
              size="sm"
            >
              {isEditMode ? (
                <>
                  <Save className="h-4 w-4" /> {isSaving ? 'Salvando...' : 'Salvar'}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" /> Editar
                </>
              )}
            </Button>
            
            {isEditMode && (
              <Button
                variant="ghost"
                onClick={() => setIsEditMode(false)}
                className="ml-2 text-muted-foreground"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" /> Cancelar
              </Button>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Welcome Cards */}
      {welcomeCards.map(card => (
        <WelcomeCard
          key={card.id}
          title={card.title}
          description={card.customProperties?.description || ''}
          color={card.customProperties?.gradient || 'bg-gradient-to-r from-blue-600 to-blue-800'}
          icon={React.createElement(getIconComponentFromId(card.iconId), { className: "h-6 w-6" })}
          showButton={false}
        />
      ))}
      
      {/* Regular Cards Grid */}
      <CardGrid
        cards={standardCards}
        onCardsChange={setCards}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onAddNewCard={handleAddNewCard}
        isEditMode={isEditMode}
      />
    </div>
  );
};

// Helper para obter componente de ícone
const getIconComponentFromId = (iconId: string) => {
  // Importações dinâmicas não são fáceis em um ambiente Lovable, então vamos usar um fallback simples
  return function DefaultIcon(props: any) {
    return <span {...props}>📋</span>;
  };
};

export default UnifiedCardGrid;
