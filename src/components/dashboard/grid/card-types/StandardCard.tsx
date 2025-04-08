
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/types/dashboard';
import { getColorClasses, getTextColorClass } from '../../utils/cardColorUtils';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface StandardCardProps {
  card: ActionCardItem;
  isMobileView?: boolean;
}

const StandardCard: React.FC<StandardCardProps> = ({ card, isMobileView }) => {
  const navigate = useNavigate();
  const colorClasses = getColorClasses(card.color);
  const textColorClass = getTextColorClass(card.color, card.id);
  const IconComponent = getIconComponentFromId(card.iconId);

  const handleCardClick = () => {
    if (card.path) {
      navigate(card.path);
    }
  };

  const iconSize = isMobileView ? "w-8 h-8" : "w-10 h-10";

  return (
    <div 
      className={`w-full h-full rounded-xl ${colorClasses} shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg py-2`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center text-center h-full px-2">
        {IconComponent && (
          <div className={`mb-2 ${textColorClass}`}>
            <IconComponent className={iconSize} />
          </div>
        )}
        <h3 className={`font-semibold ${textColorClass} text-lg`}>{card.title}</h3>
        {card.subtitle && (
          <p className={`text-sm ${textColorClass} opacity-90 mt-0.5`}>{card.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StandardCard;
