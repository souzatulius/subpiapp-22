
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/types/dashboard';

interface StandardCardProps {
  card: ActionCardItem;
  isMobileView?: boolean;
}

const StandardCard: React.FC<StandardCardProps> = ({ card, isMobileView }) => {
  const navigate = useNavigate();

  // Format title to add line breaks if it has multiple words
  const formatTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      // If there are 2 or more words, add a line break after the first word
      const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ');
      return (
        <>
          <span className="block">{firstLine}</span>
          <span className="block">{secondLine}</span>
        </>
      );
    }
    return title;
  };

  const handleCardClick = () => {
    if (card.path) {
      navigate(card.path);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {React.createElement(
          card.iconId ? card.iconId : 'div',
          { 
            className: 'h-8 w-8 mb-3 text-white' 
          }
        )}
        <h3 className="text-sm font-semibold text-white text-center leading-tight px-1">{formatTitle(card.title)}</h3>
        {card.subtitle && (
          <p className="text-xs text-white/80 mt-1.5 text-center px-1">{card.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StandardCard;
