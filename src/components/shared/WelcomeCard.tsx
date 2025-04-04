
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  userName?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon,
  color = "bg-gradient-to-r from-blue-800 to-blue-950",
  userName,
  showButton = false,
  buttonText = "Ação",
  onButtonClick
}) => {
  return (
    <Card className={`${color} text-white shadow-md p-0 border-0 overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <div>{icon}</div>}
            <div>
              <h1 className="text-xl font-semibold">
                {title} {userName && <span>, {userName}</span>}
              </h1>
              {description && (
                <p className="text-sm text-white/80 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {showButton && (
            <button
              onClick={onButtonClick}
              className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-md transition-colors"
            >
              {buttonText}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
