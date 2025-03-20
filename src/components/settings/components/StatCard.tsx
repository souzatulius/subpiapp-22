
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatCardProps } from '../types/settingsTypes';

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  section,
  highlight = false,
  unreadCount = 0
}) => {
  const navigate = useNavigate();
  
  const handleSectionClick = () => {
    navigate(`/settings?tab=${section}`);
  };
  
  return (
    <Card 
      className={`${highlight ? 'border-blue-400' : ''} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={handleSectionClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center">
          {value}
          {highlight && value > 0 && unreadCount > 0 && (
            <span className="ml-2 text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-full">
              {unreadCount} não lidas
            </span>
          )}
        </div>
        <CardDescription className="flex items-center justify-between">
          {description}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default StatCard;
