
import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Define common item structure for lists
export interface ListItem {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  date?: string;
  path?: string;
}

interface DynamicListCardProps {
  title: string;
  items: ListItem[];
  loading?: boolean;
  emptyMessage?: string;
  viewAllPath: string;
  viewAllLabel?: string;
}

// Map status to badge variants
const getStatusBadge = (status: ListItem['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'Pendente', variant: 'warning' as const };
    case 'approved':
      return { label: 'Aprovado', variant: 'success' as const };
    case 'rejected':
      return { label: 'Rejeitado', variant: 'destructive' as const };
    case 'in-progress':
      return { label: 'Em andamento', variant: 'default' as const };
    case 'completed':
      return { label: 'Concluído', variant: 'success' as const };
    default:
      return { label: 'Pendente', variant: 'default' as const };
  }
};

export const DynamicListCard: React.FC<DynamicListCardProps> = ({
  title,
  items,
  loading = false,
  emptyMessage = "Não há itens para exibir",
  viewAllPath,
  viewAllLabel = "Ver todos"
}) => {
  const navigate = useNavigate();
  
  const handleItemClick = (item: ListItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };
  
  const handleViewAll = () => {
    navigate(viewAllPath);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Clock className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const badge = getStatusBadge(item.status);
              
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 3 }}
                  onClick={() => handleItemClick(item)}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.date && <p className="text-xs text-gray-500">{item.date}</p>}
                  </div>
                  
                  <Badge variant={badge.variant} className="ml-2 whitespace-nowrap">
                    {badge.label}
                  </Badge>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1"
          onClick={handleViewAll}
        >
          <span>{viewAllLabel}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DynamicListCard;
