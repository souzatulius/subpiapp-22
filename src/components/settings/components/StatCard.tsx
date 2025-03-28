
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface StatCardProps {
  title: string;
  value?: number;
  icon: React.ReactNode;
  description: string;
  section: string;
  highlight?: boolean;
  unreadCount?: number;
  onClick?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  section,
  highlight = false,
  unreadCount = 0,
  onClick,
  showSearch = false,
  onSearch,
  searchPlaceholder = "Buscar configurações..."
}) => {
  return (
    <Card 
      className={`${highlight ? 'border-blue-400' : ''} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={showSearch ? undefined : onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {showSearch ? (
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-8 w-full"
              onChange={(e) => onSearch && onSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold flex items-center">
              {value}
              {highlight && value && value > 0 && unreadCount > 0 && (
                <span className="ml-2 text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-full">
                  {unreadCount} não lidas
                </span>
              )}
            </div>
            <CardDescription className="flex items-center justify-between">
              {description}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
