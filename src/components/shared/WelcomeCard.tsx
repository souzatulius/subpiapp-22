
import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from '@/components/settings/components/StatCard';

interface WelcomeCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  statTitle?: string;
  statValue?: number;
  statIcon?: React.ReactNode;
  statDescription?: string;
  statSection?: string;
  statHighlight?: boolean;
  statUnreadCount?: number;
  statOnClick?: () => void;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "action";
  onButtonClick?: () => void;
  color?: string;
  userName?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon = <Settings className="h-6 w-6 mr-2" />,
  statTitle,
  statValue,
  statIcon,
  statDescription,
  statSection,
  statHighlight = true,
  statUnreadCount = 0,
  statOnClick,
  color = "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
  showButton = false,
  buttonText = "Filtros e Configurações",
  buttonIcon,
  buttonVariant = "outline",
  onButtonClick,
  userName
}) => {
  return (
    <Card className={`${color} text-white shadow-lg overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center">
              {icon}
              {userName ? `Olá, ${userName}!` : title}
            </h2>
            <p className="text-blue-100">
              {description}
            </p>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            {statTitle && !showButton && (
              <StatCard 
                title={statTitle} 
                value={statValue || 0} 
                icon={statIcon}
                description={statDescription || ""} 
                section={statSection || ""}
                highlight={statHighlight}
                unreadCount={statUnreadCount}
                onClick={statOnClick}
              />
            )}
            {showButton && (
              <StatCard 
                showButton={true}
                buttonText={buttonText}
                buttonIcon={buttonIcon}
                buttonVariant={buttonVariant}
                onButtonClick={onButtonClick}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
