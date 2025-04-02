
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
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {React.createElement(
          card.iconId ? card.iconId : 'div',
          { 
            className: isMobileView ? 'h-12 w-12 mb-4 text-white' : 'h-16 w-16 mb-4 text-white' 
          }
        )}
        <h3 className="text-lg font-semibold text-white text-center">{card.title}</h3>
      </div>
    </div>
  );
};

export default StandardCard;
