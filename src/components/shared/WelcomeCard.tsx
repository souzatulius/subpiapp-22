
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home } from 'lucide-react';
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
  buttonIcon?: React.ReactNode;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'link';
  onButtonClick?: () => void;
  className?: string;
  spacingClassName?: string;
  rightContent?: React.ReactNode;
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
  buttonIcon,
  buttonVariant = 'default',
  onButtonClick,
  className,
  spacingClassName,
  rightContent
}) => {
  return <div className="bg-transparent">
      <div className="bg-transparent">
        <div className="bg-transparent py-0 text-3xl font-bold text-blue-950">
          <div className="flex items-center justify-between bg-transparent my-[24px] text-lg">
            <div className="flex items-center bg-transparent">
              {icon}
              <div>
                {greeting && userName && <div className="flex items-center">
                    <Home className="h-12 w-12 mr-2 text-blue-200" strokeWidth={2} />
                    <h2 className="text-3xl font-bold py-[13px] text-blue-950">
                      Olá, {userName}!
                    </h2>
                  </div>}
                
                <p className="mt-2 text-gray-500 font-normal text-lg">{description}</p>
              </div>
            </div>

            {rightContent && <div className="flex-shrink-0">
                {rightContent}
              </div>}
          </div>
        </div>

        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L80,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {(showButton || showResetButton) && <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {showButton && <Button variant={buttonVariant} onClick={onButtonClick} className="flex items-center gap-2">
              {buttonIcon}
              {buttonText}
            </Button>}
          
          {showResetButton && <Button variant="outline" onClick={onResetClick} className="flex items-center gap-2">
              {resetButtonIcon || <RotateCcw className="h-4 w-4" />}
              Resetar
            </Button>}
        </div>}
    </div>;
};

export default WelcomeCard;
