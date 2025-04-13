
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import SmartSearchCard from '../../SmartSearchCard';

interface SearchCardProps {
  card: ActionCardItem;
  onSearchSubmit: (query: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onSearchSubmit }) => {
  return (
    <div className="w-full h-full">
      <SmartSearchCard
        placeholder={card.title}
        onSearch={onSearchSubmit}
        className="h-full"
      />
    </div>
  );
};

export default SearchCard;
