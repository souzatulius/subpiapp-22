import React from 'react';
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
  const specialContent = React.useMemo(() => {
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
          if (onEditCard) {
            onEditCard(id);
          }
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
};

export default CardRenderer;
