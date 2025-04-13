
import React, { useMemo } from 'react';
import { getWidthClass, getHeightClass } from '../GridUtilities';
import { ActionCardItem } from '@/types/dashboard';
import { SortableUnifiedActionCard } from '../../UnifiedActionCard';
import getSpecialContent from './CardSpecialContent';

interface CardRendererProps {
  card: ActionCardItem;
  isEditMode: boolean;
  isMobileView: boolean;
  disableWiggleEffect: boolean;
  showSpecialFeatures: boolean;
  onEditCard?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
  onHideCard?: (id: string) => void;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
}

export const CardRenderer: React.FC<CardRendererProps> = ({
  card,
  isEditMode,
  isMobileView,
  disableWiggleEffect,
  showSpecialFeatures,
  onEditCard,
  onDeleteCard,
  onHideCard,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  renderSpecialCardContent
}) => {
  // Always use useMemo for specialContent calculation
  const specialContent = useMemo(() => {
    if (renderSpecialCardContent) {
      const customContent = renderSpecialCardContent(card.id);
      if (customContent) return customContent;
    }
    
    return getSpecialContent({
      card,
      renderSpecialCardContent,
      specialCardsData
    });
  }, [card, renderSpecialCardContent, specialCardsData]);
  
  // Get width and height classes
  const widthClass = useMemo(() => getWidthClass(card.width, isMobileView), [card.width, isMobileView]);
  const heightClass = useMemo(() => getHeightClass(card.height, isMobileView), [card.height, isMobileView]);
  
  // Create a safe edit handler that won't crash if onEditCard is undefined
  const handleEdit = useMemo(() => {
    return onEditCard ? (id: string) => {
      if (onEditCard) onEditCard(id);
    } : undefined;
  }, [onEditCard]);
  
  return (
    <div
      key={card.id}
      className={`${widthClass} ${heightClass}`}
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
        onEdit={handleEdit}
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
};

export default CardRenderer;
