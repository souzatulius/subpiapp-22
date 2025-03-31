
import React from 'react';
import { Button } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

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
  // Additional props that are being used in various places
  buttonIcon?: React.ReactNode;
  buttonVariant?: string;
  statTitle?: string;
  statIcon?: React.ReactNode;
  statValue?: number;
  statDescription?: string;
  statSection?: string;
  headerComponent?: React.ReactNode;
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
  color = "bg-gradient-to-r from-blue-600 to-blue-800",
  buttonIcon,
  buttonVariant = "default",
  statTitle,
  statIcon,
  statValue,
  statDescription,
  statSection
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
              className="bg-white text-blue-800 hover:bg-blue-50 inline-flex items-center"
              variant={buttonVariant as any}
            >
              {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
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

      {/* Stats section if provided */}
      {statTitle && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center">
            {statIcon && <div className="mr-2">{statIcon}</div>}
            <h3 className="text-lg font-medium">{statTitle}</h3>
          </div>
          {statValue !== undefined && (
            <div className="mt-2">
              <p className="text-2xl font-bold">{statValue}</p>
              {statDescription && <p className="text-sm text-white/80">{statDescription}</p>}
            </div>
          )}
          {statSection && <div className="mt-2">{statSection}</div>}
        </div>
      )}
    </div>
  );
};

export default WelcomeCard;
