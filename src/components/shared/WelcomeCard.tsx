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
  spacingClassName
}) => {
  return <div className="bg-transparent">
      <div className="bg-transparent">
        <div className="bg-transparent">
          <div className="flex items-center bg-transparent my-[24px]">
            {icon}
            <div>
              {greeting && userName && <h2 className="text-3xl font-bold py-[13px] text-blue-950">
                  Olá, {userName}!
                </h2>}
              
              <p className="mt-2 opacity-90 text-base">{description}</p>
            </div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L80,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Actions row */}
      {showButton || showResetButton}
    </div>;
};
export default WelcomeCard;