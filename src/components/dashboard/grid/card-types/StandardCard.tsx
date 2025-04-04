
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/types/dashboard';

interface StandardCardProps {
  card: ActionCardItem;
  isMobileView?: boolean;
}

const StandardCard: React.FC<StandardCardProps> = ({ card, isMobileView }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (card.path) {
      navigate(card.path);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4 transition-all hover:scale-[1.02] rounded-lg"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {React.createElement(
          card.iconId ? card.iconId : 'div',
          { 
            className: 'h-7 w-7 mb-3 text-white' 
          }
        )}
        <h3 className="text-sm font-semibold text-white text-center">{card.title}</h3>
        {card.subtitle && (
          <p className="text-xs text-white/90 mt-1 text-center">{card.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StandardCard;
