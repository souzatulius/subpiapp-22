
import React from 'react';
import { Button } from "@/components/ui/button";

export interface WelcomeCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
  color?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon,
  showButton = false,
  buttonText = "Começar",
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  color = "bg-gradient-to-r from-blue-600 to-blue-800"
}) => {
  return (
    <div className={`${color} rounded-xl p-6 text-white shadow-lg mb-6`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          {icon && <div className="mr-3">{icon}</div>}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-white/90">{description}</p>
          </div>
        </div>
        
        {showButton && (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onButtonClick}
              className="bg-white text-blue-800 hover:bg-blue-50"
            >
              {buttonText}
            </Button>
            
            {secondaryButtonText && (
              <Button
                onClick={onSecondaryButtonClick}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeCard;
