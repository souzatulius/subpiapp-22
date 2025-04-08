
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getWidthClass, getHeightClass } from './GridUtilities';
import CardsContainer from './CardsContainer';
import DynamicDataCard from '../DynamicDataCard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface CardGroupProps {
  card: ActionCardItem;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard?: () => void;
  specialCardsData: any;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  isMobileView?: boolean;
  isPendingTasksCard?: boolean;
}

const CardGroup: React.FC<CardGroupProps> = ({
  card,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  specialCardsData,
  quickDemandTitle = "",
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {},
  isMobileView = false,
  isPendingTasksCard = false
}) => {
  const isDynamicDataCard = card.type === 'data_dynamic' && card.dataSourceKey;
  const IconComponent = getIconComponentFromId(card.iconId);

  // Apply special height class for pending tasks card
  const heightClass = isPendingTasksCard ? 'row-span-2' : getHeightClass(card.height);

  return (
    <div 
      key={card.id}
      className={`${getWidthClass(card.width, isMobileView)} ${heightClass}`}
    >
      {isDynamicDataCard ? (
        <DynamicDataCard
          key={card.id}
          title={card.title}
          icon={IconComponent ? <IconComponent className={isMobileView ? "w-12 h-12" : "w-16 h-16"} /> : null}
          color={card.color}
          dataSourceKey={card.dataSourceKey as any}
          coordenacaoId={specialCardsData?.coordenacaoId || ''}
          usuarioId={specialCardsData?.usuarioId || ''}
        />
      ) : (
        <CardsContainer
          cards={[card]}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
          onAddNewCard={onAddNewCard}
          specialCardsData={specialCardsData}
          quickDemandTitle={quickDemandTitle}
          onQuickDemandTitleChange={onQuickDemandTitleChange}
          onQuickDemandSubmit={onQuickDemandSubmit}
          onSearchSubmit={onSearchSubmit}
          isMobileView={isMobileView}
        />
      )}
    </div>
  );
};

export default CardGroup;
