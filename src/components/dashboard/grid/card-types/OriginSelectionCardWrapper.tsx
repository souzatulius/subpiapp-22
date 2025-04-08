
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import OriginSelectionCard from '@/components/dashboard/cards/OriginSelectionCard';

interface OriginSelectionCardWrapperProps {
  card: ActionCardItem;
}

const OriginSelectionCardWrapper: React.FC<OriginSelectionCardWrapperProps> = ({
  card
}) => {
  return (
    <OriginSelectionCard 
      title={card.title || "De onde vem a solicitação?"}
    />
  );
};

export default OriginSelectionCardWrapper;
