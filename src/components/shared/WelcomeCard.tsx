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
  resetButtonIcon = <RotateCcw className="h-4 w-4" />,
  rightContent
}) => {
  // Ensure userName is treated as a string even if it's undefined
  const displayName = userName || '';

  // Text color is now fixed to gray-900 for the greeting
  const textColorClass = 'text-gray-900';

  // Description text color
  const descriptionColorClass = 'text-gray-600';
  return <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="border border-none bg-transparent">
        <div className="border border-none bg-transparent rounded-none">
          <div className="px-0 py-0">
            <h2 className={`${greeting && displayName ? 'text-3xl' : 'text-2xl'} font-bold mb-3 flex items-center text-gray-900`}>
              {icon}
              {greeting && displayName ? `Olá, ${displayName}!` : title}
            </h2>
            <p className={descriptionColorClass}>
              {description}{!description.endsWith('.') && '.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {showResetButton && <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onResetClick} className="bg-gray-100 py-0 my-[33px]">
                      {resetButtonIcon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Resetar Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
            
            {showButton && <Button variant={buttonVariant} onClick={onButtonClick} className="bg-gray-100">
                {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
                {buttonText}
              </Button>}
            
            {rightContent && <div className="ml-2">
                {rightContent}
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default WelcomeCard;