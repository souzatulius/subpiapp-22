
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';

interface SearchCardProps {
  card: ActionCardItem;
  onSearchSubmit: (query: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ card, onSearchSubmit }) => {
  const handleSearch = (query: string) => {
    onSearchSubmit(query);
  };

  return (
    <div className="w-full h-full">
      <div className="h-full flex flex-col">
        <div className="relative w-full flex-grow">
          <input
            type="text"
            placeholder={card.title || "Buscar..."}
            className="w-full h-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleSearch(input.value);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
