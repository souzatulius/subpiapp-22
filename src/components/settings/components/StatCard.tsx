
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface StatCardProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  showSearch = false,
  onSearch,
  searchPlaceholder = "Buscar configurações..."
}) => {
  return (
    <Card className="w-full cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {showSearch && (
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-8 w-full"
              onChange={(e) => onSearch && onSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
