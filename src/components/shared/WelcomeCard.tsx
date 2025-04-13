
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WelcomeCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  greeting?: boolean;
  userName?: string;
  userNameClassName?: string;
  showResetButton?: boolean;
  onResetClick?: () => void;
  resetButtonIcon?: React.ReactNode;
  showButton?: boolean;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'link';
  onButtonClick?: () => void;
  className?: string;
  spacingClassName?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon,
  color = 'bg-gradient-to-r from-blue-600 to-blue-800',
  greeting = false,
  userName,
  userNameClassName,
  showResetButton = false,
  onResetClick,
  resetButtonIcon,
  showButton = false,
  buttonText = 'Personalizar',
  buttonVariant = 'default',
  onButtonClick,
  className,
  spacingClassName,
}) => {
  return (
    <div className={cn("relative rounded-xl overflow-hidden shadow-md", className)}>
      <div className={`${color} p-6 text-white relative overflow-hidden`}>
        <div className={cn("relative z-10 space-y-2", spacingClassName)}>
          <div className="flex items-center">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div>
              {greeting && userName && (
                <h2 className={cn("text-xl font-semibold mb-1", userNameClassName || "text-white")}>
                  Olá, {userName}!
                </h2>
              )}
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="text-sm mt-2 opacity-90">{description}</p>
            </div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,0 L100,0 L80,100 L0,100 Z" 
              fill="currentColor" 
            />
          </svg>
        </div>
      </div>

      {/* Actions row */}
      {(showButton || showResetButton) && (
        <div className="bg-white p-4 flex justify-end items-center border-t border-gray-100">
          {showResetButton && (
            <Button 
              variant="secondary"
              size="sm"
              onClick={onResetClick}
              className="mr-auto bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            >
              {resetButtonIcon || <RotateCcw className="h-4 w-4 mr-2" />}
              Restaurar Padrão
            </Button>
          )}
          
          {showButton && (
            <Button 
              variant={buttonVariant}
              size="sm"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default WelcomeCard;
