
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Search, BarChart2, GripHorizontal } from 'lucide-react';
import { cva } from 'class-variance-authority';

interface SortableGraphCardProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  isVisible?: boolean;
  showAnalysis?: boolean;
  analysis?: string;
  isLoading?: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const cardVariants = cva(
  "relative border rounded-lg overflow-hidden transition-all duration-200",
  {
    variants: {
      state: {
        default: "border-gray-200 bg-white",
        dragging: "border-orange-400 bg-orange-50 shadow-md",
        loading: "border-gray-200 bg-gray-50",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  description,
  children,
  isVisible = true,
  showAnalysis = false,
  analysis = "",
  isLoading = false,
  onToggleVisibility,
  onToggleAnalysis,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isLoading,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const cardState = isLoading 
    ? "loading" 
    : isDragging 
      ? "dragging" 
      : "default";
      
  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={cardVariants({ state: cardState })}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="p-4 flex flex-row justify-between items-center border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-gray-800">{title}</h3>
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div 
            className={`flex space-x-2 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          >
            {onToggleAnalysis && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onToggleAnalysis) onToggleAnalysis();
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                title="Mostrar análise"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
            {onToggleVisibility && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onToggleVisibility) onToggleVisibility();
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                title="Ocultar card"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div
            {...attributes}
            {...listeners}
            className="h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <GripHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {showAnalysis && analysis ? (
          <div className="p-4 h-[250px] overflow-auto bg-orange-50 text-orange-800">
            <div className="flex items-center gap-2 mb-2 font-medium text-orange-700">
              <Search className="h-4 w-4" />
              <span>Análise do Gráfico</span>
            </div>
            <p className="text-sm">{analysis}</p>
          </div>
        ) : (
          <div className="h-auto">{children}</div>
        )}
      </CardContent>
    </Card>
  );
};
