
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface SortableKPICardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string | number;
  change?: number;
  status: 'positive' | 'negative' | 'neutral';
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
  status,
  description,
  secondary,
  isLoading = false,
  isEditMode = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    if (!change) return null;
    
    return status === 'positive' ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-slate-600">
                {icon}
                <span className="font-medium">{title}</span>
              </div>
              
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute top-2 right-2 cursor-grab"
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-end gap-2 mb-1">
              <div className="text-2xl font-bold">{value}</div>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-slate-500">
              <p>{description}</p>
              {secondary && <p className="mt-1">{secondary}</p>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
