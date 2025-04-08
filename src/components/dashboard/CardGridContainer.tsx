
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from './UnifiedCardGrid';
import { useSpecialCardsData } from '@/hooks/dashboard/useSpecialCardsData';
import { Skeleton } from '@/components/ui/skeleton';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (id: string) => void;
  onAddNewCard?: () => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  renderSpecialCardContent?: (cardId: string, card?: ActionCardItem) => React.ReactNode;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards = [],
  onCardsChange,
  onEditCard,
  onHideCard,
  onAddNewCard,
  isMobileView = false,
  isEditMode = false,
  disableWiggleEffect = true,
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  renderSpecialCardContent
}) => {
  const {
    overdueCount,
    overdueItems,
    notesToApprove,
    responsesToDo,
    isLoading: isLoadingSpecialData,
    isComunicacao,
    userCoordenaticaoId
  } = useSpecialCardsData();

  const specialCardsData = {
    overdueCount,
    overdueItems,
    notesToApprove,
    responsesToDo,
    isLoading: isLoadingSpecialData,
    coordenacaoId: userCoordenaticaoId || '',
    usuarioId: '',
    isComunicacao,
    renderSpecialCardContent
  };

  return isLoadingSpecialData ? (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  ) : (
    <UnifiedCardGrid
      cards={cards}
      onCardsChange={onCardsChange}
      onEditCard={onEditCard}
      onDeleteCard={onHideCard}
      onHideCard={onHideCard}
      isMobileView={isMobileView}
      isEditMode={isEditMode}
      disableWiggleEffect={disableWiggleEffect}
      showSpecialFeatures={showSpecialFeatures}
      quickDemandTitle={quickDemandTitle}
      onQuickDemandTitleChange={onQuickDemandTitleChange}
      onQuickDemandSubmit={onQuickDemandSubmit}
      onSearchSubmit={onSearchSubmit}
      specialCardsData={specialCardsData}
    />
  );
};

export default CardGridContainer;
