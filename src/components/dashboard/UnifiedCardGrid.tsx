import React, { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortableUnifiedActionCard } from './UnifiedActionCard';
import { getWidthClass, getHeightClass, getMobileSpecificDimensions } from './grid/GridUtilities';
import { ActionCardItem, CardWidth, CardHeight } from '@/types/dashboard';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';
import PendingActivitiesCard from './cards/PendingActivitiesCard';
import OriginsDemandCardWrapper from './cards/OriginsDemandCardWrapper';
import PendingTasksCard from './cards/PendingTasksCard';
import ComunicadosCard from './cards/ComunicadosCard';
import UserProfileCard from './cards/UserProfileCard';
import NotificationSettingsCard from './cards/NotificationSettingsCard';

export interface UnifiedCardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onDeleteCard?: (id: string) => void;
  onHideCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
}

const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards = [],
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  disableWiggleEffect = true,
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  renderSpecialCardContent
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove([...cards], oldIndex, newIndex);
        
        if (isMobileView) {
          newCards.forEach((card, index) => {
            card.mobileOrder = index;
          });
        }
        
        onCardsChange(newCards);
      }
    }
  };

  const visibleCards = cards.filter(card => !card.isHidden);

  const displayedCards = isMobileView
    ? visibleCards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : visibleCards;

  const processCardDimensions = useCallback((card: ActionCardItem) => {
    if (isMobileView) {
      const mobileSpecific = getMobileSpecificDimensions(card.title);
      
      if (card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart') {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '2' as CardHeight
        };
      }
      
      return {
        ...card,
        width: mobileSpecific.width,
        height: mobileSpecific.height
      };
    } else {
      if (card.title === "Busca Rápida") {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '0.5' as CardHeight
        };
      } else if (card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart') {
        return {
          ...card,
          width: '50' as CardWidth,
          height: '2' as CardHeight
        };
      } else if (card.title === "Demandas" || card.title === "Área da Comunicação") {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '1' as CardHeight
        };
      } else if (card.title === "Atividades Pendentes") {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '3' as CardHeight
        };
      }
    }
    return card;
  }, [isMobileView]);

  const processedCards = React.useMemo(() => {
    return displayedCards.map(card => processCardDimensions(card));
  }, [displayedCards, processCardDimensions]);

  const { occupiedSlots } = useGridOccupancy(
    processedCards.map(card => ({
      id: card.id,
      width: card.width || '25',
      height: card.height || '1',
      type: card.type
    })),
    isMobileView
  );

  if (!displayedCards || displayedCards.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }

  const getSpecialContent = (card: ActionCardItem) => {
    if (renderSpecialCardContent) {
      const customContent = renderSpecialCardContent(card.id);
      if (customContent) return customContent;
    }

    if (card.type === 'origin_demand_chart' || card.id === 'origem-demandas-card' || 
        card.id.includes('origem-demandas') || 
        card.id.includes('origemDemandas') ||
        card.id.includes('origin-demand-chart') ||
        card.title === "Atividades em Andamento") {
      return <OriginsDemandCardWrapper 
        className="w-full h-full" 
        color={card.color}
        title={card.title}
        subtitle={card.subtitle}
      />;
    }
    
    if (card.type === 'pending_actions' || card.isPendingActions) {
      return <PendingActivitiesCard 
        color={card.color}
        title={card.title}
        subtitle={card.subtitle}
      />;
    }
    
    if (card.type === 'pending_tasks' || card.isPendingTasks) {
      return <PendingTasksCard 
        id={card.id}
        title={card.title}
        userDepartmentId={card.departmentId}
        isComunicacao={card.isComunicacao}
      />;
    }
    
    if (card.type === 'communications' || card.isComunicados) {
      return <ComunicadosCard 
        id={card.id}
        title={card.title}
        className="w-full h-full shadow-md border border-gray-100 rounded-xl"
      />;
    }
    
    if (card.type === 'user_profile' || card.isUserProfile) {
      return <UserProfileCard
        id={card.id}
        title={card.title}
      />;
    }
    
    if (card.type === 'notification_settings' || card.isNotificationSettings) {
      return <NotificationSettingsCard
        id={card.id}
        title={card.title}
      />;
    }
    
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={`w-full grid gap-3 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4 grid-flow-dense'}`}>
        <SortableContext items={processedCards.map(card => card.id)}>
          {processedCards.map(card => {
            const specialContent = getSpecialContent(card);
              
            return (
              <div
                key={card.id}
                className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height, isMobileView)}`}
              >
                <SortableUnifiedActionCard
                  id={card.id}
                  title={card.title}
                  subtitle={card.subtitle}
                  iconId={card.iconId}
                  path={card.path}
                  color={card.color}
                  width={card.width}
                  height={card.height}
                  isDraggable={isEditMode}
                  isEditing={isEditMode}
                  onEdit={onEditCard ? (id) => {
                    const cardToEdit = cards.find(c => c.id === id);
                    if (cardToEdit) onEditCard(cardToEdit);
                  } : undefined}
                  onDelete={onDeleteCard}
                  onHide={onHideCard}
                  iconSize={isMobileView ? 'lg' : 'xl'}
                  disableWiggleEffect={disableWiggleEffect}
                  type={card.type}
                  isQuickDemand={card.isQuickDemand}
                  isSearch={card.isSearch}
                  showSpecialFeatures={showSpecialFeatures}
                  quickDemandTitle={quickDemandTitle}
                  onQuickDemandTitleChange={onQuickDemandTitleChange}
                  onQuickDemandSubmit={onQuickDemandSubmit}
                  onSearchSubmit={onSearchSubmit}
                  specialCardsData={specialCardsData}
                  isCustom={card.isCustom}
                  hasBadge={card.hasBadge}
                  badgeValue={card.badgeValue}
                  hasSubtitle={!!card.subtitle}
                  isMobileView={isMobileView}
                  isPendingActions={card.isPendingActions}
                  isUserProfile={card.isUserProfile}
                  isNotificationSettings={card.isNotificationSettings}
                  specialContent={specialContent}
                />
              </div>
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default UnifiedCardGrid;
