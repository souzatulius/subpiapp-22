
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WelcomeCardProps {
  title: string;
  description?: string;
  greeting?: string;
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
  greeting,
  icon,
  color = 'bg-gradient-to-r from-blue-500 to-blue-700',
  userName,
  showButton = false,
  buttonText = 'Começar',
  onButtonClick
}) => {
  return (
    <Card className={`border-none overflow-hidden shadow-md ${color} text-white`}>
      <CardHeader className="relative pb-8 md:pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            {greeting ? (
              <CardTitle className="text-xl md:text-2xl font-bold mb-1">{greeting}</CardTitle>
            ) : (
              userName ? (
                <CardTitle className="text-xl md:text-2xl font-bold mb-1">Olá, {userName}!</CardTitle>
              ) : (
                <CardTitle className="text-xl md:text-2xl font-bold mb-1 flex items-center">{icon} {title}</CardTitle>
              )
            )}
            
            {description && (
              <CardDescription className="text-white/80 text-sm md:text-base">{description}</CardDescription>
            )}
          </div>
          
          {showButton && (
            <button
              onClick={onButtonClick}
              className="bg-white text-blue-700 px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all hover:bg-gray-100 text-sm font-medium"
            >
              {buttonText}
            </button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default WelcomeCard;
