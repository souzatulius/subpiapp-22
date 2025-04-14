
import React from 'react';
import { Settings, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from './StatCard';

interface WelcomeCardProps {
  userCount?: number;
  unreadCount?: number;
  color?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "action";
  onButtonClick?: () => void;
  label?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ 
  userCount, 
  unreadCount = 0,
  color = "bg-transparent",
  showButton = false,
  buttonText = "Gerenciar Dashboards",
  buttonIcon = <LayoutDashboard className="h-4 w-4" />,
  buttonVariant = "secondary",
  onButtonClick,
  label = "usuários"
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-xl bg-white mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-5 flex items-center text-gray-950">
              <Settings className="h-6 w-6 mr-2 text-gray-800" />
              Central de Configurações
            </h2>
            <p className="text-gray-600">
              Gerencie todas as configurações do sistema em um só lugar.
            </p>
          </div>
          {showButton && (
            <div>
              <StatCard
                showButton={true}
                buttonText={buttonText}
                buttonIcon={buttonIcon}
                buttonVariant={buttonVariant}
                onButtonClick={onButtonClick}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
