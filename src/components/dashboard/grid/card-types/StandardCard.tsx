
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardItem } from '@/types/dashboard';
import * as LucideIcons from 'lucide-react';
import ChartPreview from '@/components/dashboard/charts/ChartPreview';

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
      return <LucideIcon className="w-10 h-10 text-white" />; // Changed from w-8 h-8 to w-10 h-10
    }
    
    // Fallback for icon not found
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full"> // Changed from w-8 h-8 to w-10 h-10
        <span className="text-white text-xs">{card.iconId.charAt(0)}</span>
      </div>
    );
  };
  
  // If this card has a chartId, render the chart instead of the standard content
  if (card.chartId) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4 px-4"
        onClick={handleCardClick}
      >
        <ChartPreview chartId={card.chartId} />
      </div>
    );
  }

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
