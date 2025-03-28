
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface StatCardProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  title?: string;
  value?: number;
  icon?: React.ReactNode;
  description?: string;
  section?: string;
  highlight?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  showSearch = false,
  onSearch,
  searchPlaceholder = "Buscar configurações...",
  title,
  value,
  icon,
  description,
  section,
  highlight = false,
  unreadCount = 0,
  onClick
}) => {
  return (
    <Card 
      className={`${highlight ? 'border-blue-400' : ''} w-full cursor-pointer hover:shadow-md transition-shadow`}
      onClick={showSearch ? undefined : onClick}
    >
      <CardContent className="p-4">
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
            {title && icon && (
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{title}</div>
                {icon}
              </div>
            )}
            {typeof value !== 'undefined' && (
              <div className="text-2xl font-bold flex items-center">
                {value}
                {highlight && unreadCount > 0 && (
                  <span className="ml-2 text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-full">
                    {unreadCount} não lidas
                  </span>
                )}
              </div>
            )}
            {description && (
              <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
                {description}
                {onClick && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
