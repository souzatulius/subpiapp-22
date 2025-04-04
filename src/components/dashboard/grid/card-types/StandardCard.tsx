
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
      // Prevent navigation to the same page
      if (window.location.pathname === card.path) {
        console.log('Already on this page');
        return;
      }
      navigate(card.path);
    }
  };

  // Function to dynamically import and render the icon
  const renderIcon = () => {
    if (!card.iconId) return null;
    
    try {
      // Use require to dynamically import the icon
      const Icon = require('lucide-react')[card.iconId.split('-').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('')] || null;
      
      if (Icon) {
        return <Icon className="h-5 w-5 mb-1 text-white" />;
      }
      
      return null;
    } catch (error) {
      console.error(`Error loading icon ${card.iconId}:`, error);
      return null;
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-2 transition-all duration-200 hover:brightness-110 hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {renderIcon()}
        <h3 className="text-xs font-semibold text-white text-center">{card.title}</h3>
        {card.subtitle && (
          <p className="text-xs text-white/80 mt-0.5 text-center">{card.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StandardCard;
