
import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownIcon, ArrowUpIcon, GripVertical, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SortableKPICardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  value: string | number;
  status: 'positive' | 'negative' | 'neutral';
  description: string;
  secondary?: string;
  change?: number;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export const SortableKPICard = forwardRef<HTMLDivElement, SortableKPICardProps>(({
  id,
  title,
  icon,
  value,
  status,
  description,
  secondary,
  change,
  isLoading = false,
  isEditMode = false
}, ref) => {
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
    transition
  };

  const cardRef = React.useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [setNodeRef, ref]);

  return (
    <motion.div
      ref={cardRef}
      style={style}
      {...attributes}
      {...(isEditMode ? listeners : {})}
      className={cn(
        "relative",
        isDragging ? "z-10" : "z-0"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card 
        className={cn(
          "border border-gray-200 overflow-hidden",
          isDragging ? "shadow-lg" : "shadow-sm",
          "transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]"
        )}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="mr-2 text-subpi-blue">{icon}</div>
              <h3 className="text-base font-semibold text-subpi-blue">{title}</h3>
            </div>
            {isEditMode && (
              <GripVertical className="h-4 w-4 cursor-grab text-gray-400 hover:text-gray-600" />
            )}
          </div>

          {isLoading ? (
            <div className="mt-2 space-y-3">
              <Skeleton className="h-8 w-24 bg-gray-100" />
              <Skeleton className="h-3 w-32 bg-gray-100" />
            </div>
          ) : (
            <>
              <div className="mt-2 flex items-end">
                <span className="text-[2.25rem] leading-tight font-bold text-orange-500">
                  {value}
                </span>
                {typeof change === 'number' && (
                  <div className="flex items-center ml-2 mb-1.5 text-orange-500">
                    {change > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                    ) : change < 0 ? (
                      <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                    ) : (
                      <Minus className="h-3 w-3 mr-0.5" />
                    )}
                    <span className="text-[0.9rem] font-medium">
                      {Math.abs(change)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[0.95rem] text-gray-700 mt-1">{description}</p>
              {secondary && (
                <p className="text-[0.8rem] text-orange-500 mt-0.5">{secondary}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

SortableKPICard.displayName = 'SortableKPICard';
