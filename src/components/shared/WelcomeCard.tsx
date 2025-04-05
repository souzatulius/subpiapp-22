
import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon = <Settings className="h-6 w-6 mr-2" />,
  color = "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
  showButton = false,
  buttonText = "Filtros e Configurações",
  buttonIcon,
  buttonVariant = "outline",
  onButtonClick,
  userName,
  greeting = false
}) => {
  return (
    <Card className={`${color} text-white shadow-lg overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center">
              {icon}
              {greeting && userName ? `Olá, ${userName}!` : title}
            </h2>
            <p className="text-blue-100">
              {description}
            </p>
          </div>
          
          {showButton && (
            <div>
              <Button
                variant={buttonVariant}
                onClick={onButtonClick}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
                {buttonText}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
