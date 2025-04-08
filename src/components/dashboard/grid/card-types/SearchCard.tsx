
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import SmartSearchCard from '../../SmartSearchCard';

interface SearchCardProps {
  card: ActionCardItem;
  onSearchSubmit: (query: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onSearchSubmit }) => {
  return (
    <SmartSearchCard
      placeholder={card.title}
      onSearch={onSearchSubmit}
    />
  );
};

export default SearchCard;
