
import React from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WelcomeCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  userName?: string;
  greeting?: boolean;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "action";
  onButtonClick?: () => void;
  showResetButton?: boolean;
  onResetClick?: () => void;
  resetButtonIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon = <Settings className="h-8 w-8 mr-2 text-gray-800" />,
  color = "bg-transparent",
  showButton = false,
  buttonText = "Filtros e Configurações",
  buttonIcon,
  buttonVariant = "outline",
  onButtonClick,
  userName,
  greeting = false,
  showResetButton = false,
  onResetClick,
  resetButtonIcon = <RotateCcw className="h-4 w-4 text-white" />,
  rightContent
}) => {
  // Ensure userName is treated as a string even if it's undefined
  const displayName = userName || '';
  
  return (
    <div className="py-0 mx-0 px-0">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h2 className={`${greeting && displayName ? 'text-3xl' : 'text-2xl'} font-bold flex items-center text-gray-950`}>
            {icon}
            {greeting && displayName ? `Olá, ${displayName}!` : title}
          </h2>
          <p className="text-gray-600 mt-4 mb-6">
            {description}{!description.endsWith('.') && '.'}
          </p>
        </div>
        
        <div className="flex items-center">
          {showResetButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={onResetClick} 
                    className="rounded-full bg-blue-600 hover:bg-blue-700 mr-2"
                  >
                    {resetButtonIcon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resetar Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {showButton && (
            <Button 
              variant={buttonVariant} 
              onClick={onButtonClick} 
              className="bg-transparent hover:bg-gray-100 focus:ring-0 shadow-none"
            >
              {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
              {buttonText}
            </Button>
          )}
          
          {rightContent && (
            <div className="ml-2">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
