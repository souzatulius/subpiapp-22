
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/types/dashboard';

interface StandardCardProps {
  card: ActionCardItem;
  isMobileView?: boolean;
}

const StandardCard: React.FC<StandardCardProps> = ({ card, isMobileView }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if we have a path and the click was directly on this component
    // not on a child control element
    if (card.path && e.target === e.currentTarget) {
      e.stopPropagation();
      navigate(card.path);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-2"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {React.createElement(
          card.iconId ? card.iconId : 'div',
          { 
            className: 'h-6 w-6 mb-1 text-white' 
          }
        )}
        <h3 className="text-sm font-semibold text-white text-center">{card.title}</h3>
        {card.subtitle && (
          <p className="text-xs text-white/80 mt-0.5 text-center">{card.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StandardCard;
