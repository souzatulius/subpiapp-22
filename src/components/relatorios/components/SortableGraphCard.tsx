
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, EyeOff, GripVertical, MessageSquare } from 'lucide-react';

interface SortableGraphCardProps {
  id: string;
  title: string;
  description?: string;
  isVisible: boolean;
  showAnalysis: boolean;
  analysis?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  onToggleView?: () => void;
}

export const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  description,
  isVisible,
  showAnalysis,
  analysis,
  isLoading = false,
  children,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView
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
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto' as any
  };

  if (!isVisible) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-[250px] flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (showAnalysis) {
      return (
        <div className="h-[250px] p-6 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-10 w-10 mb-3 text-blue-400" />
          <h4 className="font-medium text-lg text-gray-800 mb-2">{title}</h4>
          <p className="text-gray-600">{analysis || 'Nenhuma análise disponível para este gráfico.'}</p>
        </div>
      );
    }

    return children;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="chart-card bg-white border-blue-200 shadow-sm hover:shadow transition-all"
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab mr-2 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base text-blue-700">{title}</CardTitle>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
        <div className="flex gap-1 print:hidden">
          {onToggleAnalysis && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-blue-800"
              onClick={onToggleAnalysis}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}

          {onToggleView && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-blue-800"
              onClick={onToggleView}
            >
              {showAnalysis ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
