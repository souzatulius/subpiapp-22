
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, GripVertical, Search } from 'lucide-react';

interface SortableGraphCardProps {
  id: string;
  title: string;
  description?: string;
  isVisible: boolean;
  isLoading?: boolean;
  isEditMode?: boolean;
  showAnalysis?: boolean;
  analysis?: string;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  children: React.ReactNode;
}

export const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  description,
  isVisible,
  isLoading = false,
  isEditMode = false,
  showAnalysis = false,
  analysis,
  onToggleVisibility,
  onToggleAnalysis,
  children,
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
    position: 'relative' as const,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="overflow-hidden group"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {isEditMode ? (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onToggleVisibility}
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 cursor-grab"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleAnalysis && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onToggleAnalysis}
                title={showAnalysis ? "Ocultar análise" : "Ver análise"}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <>
            {children}
            {showAnalysis && analysis && (
              <div className="p-4 bg-slate-50 border-t">
                <h4 className="text-sm font-medium text-slate-700 mb-1">Análise</h4>
                <p className="text-sm text-slate-600">{analysis}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
