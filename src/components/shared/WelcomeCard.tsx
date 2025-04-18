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
                <Home strokeWidth={1.5} className="h-12 w-12 mr-3 text-gray-300" />
                <h2 className="font-semibold text-3xl text-gray-600">
                  Olá, {userName}!
                </h2>
              </div> : <div className="flex flex-col items-start">
                {icon}
                <div>
                  <h2 className="font-semibold text-3xl text-gray-600 mb-2">{title}</h2>
                  <p className="opacity-90 text-gray-500 font-normal text-lg">{description}</p>
                </div>
              </div>}
          </div>

          {rightContent && <div className="flex-shrink-0">
              {rightContent}
            </div>}
        </div>
      </div>

      {!hideFunctions && (showButton || showResetButton)}
    </div>;
};
export default WelcomeCard;