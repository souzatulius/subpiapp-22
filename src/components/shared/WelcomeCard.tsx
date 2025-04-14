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
  hideFunctions?: boolean;
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
  rightContent,
  hideFunctions = false
}) => {
  return <div className="bg-transparent">
      <div className="bg-transparent">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-transparent my-[47px]">
          <div className=" text-blue-300 h-15 w-15">
            {greeting && userName ? <div className="flex items-center">
                <Home className="h-8 w-8 mr-3 text-white/90" strokeWidth={1.5} />
                <h2 className={cn("text-2xl font-bold", userNameClassName || "text-white")}>
                  Olá, {userName}!
                </h2>
              </div> : <div className=" relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-transparent my-[47px]">
                {icon}
                <div className="py-0 my-0">
                  <h2 className="text-2xl font-bold mb-2 text-blue-500 py-0 my-[4px">{title}</h2>
                  <p className=" opacity-90 text-gray-500 my-0 py-0 font-normal text-lg">{description}</p>
                </div>
              </div>}
          </div>

          {rightContent && <div className="flex-shrink-0">
              {rightContent}
            </div>}
        </div>

        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L80,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {!hideFunctions && (showButton || showResetButton) && <div className={cn("flex flex-col sm:flex-row gap-2 px-6 py-3 bg-white", spacingClassName)}>
          {showButton && <Button variant={buttonVariant} onClick={onButtonClick} className="flex items-center gap-2">
              {buttonIcon}
              {buttonText}
            </Button>}
          
          {showResetButton && <Button variant="outline" onClick={onResetClick} className="flex items-center gap-2">
              {resetButtonIcon || <RotateCcw className="h-4 w-4" />}
              Redefinir Padrão
            </Button>}
        </div>}
    </div>;
};
export default WelcomeCard;