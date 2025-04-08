
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import * as LucideIcons from 'lucide-react';

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

  const renderIcon = () => {
    if (!card.iconId) return null;
    
    // Try to get the icon from Lucide directly
    const LucideIcon = (LucideIcons as any)[card.iconId];
    if (LucideIcon) {
      return <LucideIcon className="w-8 h-8 text-white" />;
    }
    
    // Fallback to our custom icon loader
    const IconComponent = getIconComponentFromId(card.iconId);
    return IconComponent ? <IconComponent className="w-8 h-8 text-white" /> : null;
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-white mb-3">
          {renderIcon()}
        </div>
        <h3 className="text-lg font-semibold text-white text-center">{card.title}</h3>
        {card.subtitle && (
          <p className="text-sm text-white/80 mt-1 text-center">{card.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StandardCard;
