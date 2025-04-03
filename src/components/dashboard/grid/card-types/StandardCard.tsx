
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
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center">
        {React.createElement(
          card.iconId ? card.iconId : 'div',
          { 
            className: isMobileView ? 'h-8 w-8 mb-2 text-white' : 'h-8 w-8 mb-2 text-white' 
          }
        )}
        <h3 className="text-sm font-semibold text-white text-center">{card.title}</h3>
      </div>
    </div>
  );
};

export default StandardCard;
