
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import SmartSearchCard from '../../SmartSearchCard';

interface SearchCardProps {
  card: ActionCardItem;
  onSearchSubmit: (query: string) => void;
  isEditMode?: boolean;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onSearchSubmit, isEditMode = false }) => {
  return (
    <SmartSearchCard
      placeholder={card.title || "O que vamos fazer?"}
      onSearch={onSearchSubmit}
      isEditMode={isEditMode}
    />
  );
};

export default SearchCard;
