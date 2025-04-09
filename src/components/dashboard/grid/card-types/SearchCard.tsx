
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import SmartSearchCard from '../../SmartSearchCard';

interface SearchCardProps {
  card: ActionCardItem;
  onSearchSubmit: (query: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onSearchSubmit }) => {
  return (
    <div className="relative w-full h-full overflow-visible">
      <div className="w-full h-full overflow-visible-container">
        <SmartSearchCard
          placeholder={card.title}
          onSearch={onSearchSubmit}
        />
      </div>
    </div>
  );
};

export default SearchCard;
