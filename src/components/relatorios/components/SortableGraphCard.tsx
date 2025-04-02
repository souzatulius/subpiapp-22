
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Search, Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SortableGraphCardProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  isVisible: boolean;
  showAnalysis: boolean;
  analysis?: string;
  isLoading?: boolean;
  isEditMode?: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
}

export const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  description,
  children,
  isVisible,
  showAnalysis,
  analysis,
  isLoading = false,
  isEditMode = false,
  onToggleVisibility,
  onToggleAnalysis
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

  if (!isVisible && !isEditMode) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode ? { ...attributes, ...listeners } : {})}
    >
      {showAnalysis ? (
        <Card className={cn(
          "border border-orange-200 hover:shadow-md transition-all rounded-xl overflow-hidden h-full",
          "bg-gradient-to-r from-orange-50 to-orange-100",
          isDragging && "ring-2 ring-blue-500"
        )}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4 bg-gradient-to-r from-orange-200 to-orange-300">
            <h3 className="text-base font-medium text-orange-900">{title} - Análise</h3>
            <div className="flex space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAnalysis();
                }}
                className="p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-orange-700 hover:text-orange-900 transition-all"
                title="Mostrar gráfico"
              >
                <Search className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                className="p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-orange-700 hover:text-orange-900 transition-all"
                title="Ocultar card"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-orange-800 text-sm">{analysis}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(
          "border border-slate-200 hover:shadow-md transition-all rounded-xl overflow-hidden",
          "bg-gradient-to-b from-white to-slate-50",
          isDragging && "ring-2 ring-blue-500"
        )}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4 bg-gradient-to-r from-blue-700 to-blue-800">
            <div>
              <h3 className="text-base font-medium text-white">{title}</h3>
              {description && <p className="text-xs text-blue-100">{description}</p>}
            </div>
            <div className="flex space-x-1">
              {analysis && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAnalysis();
                  }}
                  className="p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 hover:text-blue-900 transition-all"
                  title="Mostrar análise"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                className="p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 hover:text-blue-900 transition-all"
                title="Ocultar card"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            {isLoading ? (
              <Skeleton className="h-[250px] w-full bg-slate-100 rounded-lg" />
            ) : (
              <div className="h-[250px] overflow-auto">
                {children}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
