
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SortableKPICardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string | number;
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
  description: string;
  secondary?: string;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export const SortableKPICard: React.FC<SortableKPICardProps> = ({
  id,
  title,
  icon,
  value,
  change,
  status = 'neutral',
  description,
  secondary,
  isLoading = false,
  isEditMode = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    cursor: isEditMode ? 'grab' : 'default',
    animation: isEditMode ? 'wiggle 1s infinite' : 'none'
  };

  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'positive':
        return <ArrowUpIcon className="h-4 w-4 mr-1" />;
      case 'negative':
        return <ArrowDownIcon className="h-4 w-4 mr-1" />;
      default:
        return <Minus className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode ? { ...attributes, ...listeners } : {})}
    >
      <Card className={cn(
        "border border-gray-200 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden",
        "bg-gradient-to-b from-gray-50 to-white",
        isDragging && "ring-2 ring-blue-500"
      )}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
          <h3 className="text-sm font-medium text-slate-800">{title}</h3>
          <div className="h-5 w-5 text-orange-500">{icon}</div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-24 bg-gray-100 rounded-lg mb-1" />
              <Skeleton className="h-4 w-32 bg-gray-50 rounded-lg" />
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-500">{description}</div>
              {change !== undefined && (
                <div className={`mt-2 flex items-center gap-1 text-xs ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span>{secondary}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
