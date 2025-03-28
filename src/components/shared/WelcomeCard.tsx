
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
  color?: string;
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
  color = "bg-gradient-to-r from-blue-500 to-blue-700"
}) => {
  return (
    <Card className={`${color} text-white shadow-lg overflow-hidden`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              {icon}
              {title}
            </h2>
            <p className="text-blue-100">
              {description}
            </p>
          </div>
          {statTitle && (
            <div className="flex space-x-4">
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
