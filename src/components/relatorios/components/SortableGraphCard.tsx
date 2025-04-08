
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Search, GripVertical } from 'lucide-react';

interface SortableGraphCardProps {
  id: string;
  title: string;
  description?: string;
  isVisible: boolean;
  showAnalysis: boolean;
  analysis?: string;
  isLoading?: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  onExport?: () => void;
  hideMenuIcon?: boolean;
  children: React.ReactNode;
}

const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  description,
  isVisible,
  showAnalysis,
  analysis = "Análise de dados não disponível para este gráfico.",
  isLoading = false,
  onToggleVisibility,
  onToggleAnalysis,
  onExport,
  hideMenuIcon = false,
  children
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className="relative shadow-md rounded-xl overflow-hidden bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Drag handle - remains visible always */}
      {!hideMenuIcon && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-3 left-3 cursor-grab active:cursor-grabbing p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <GripVertical size={16} />
        </div>
      )}
      
      {/* Hover controls - only visible on hover */}
      <div 
        className={`absolute top-3 right-3 flex space-x-2 transition-opacity duration-200 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {onToggleAnalysis && (
          <button
            onClick={onToggleAnalysis}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title={showAnalysis ? "Mostrar gráfico" : "Mostrar análise"}
          >
            <Search size={16} />
          </button>
        )}
        
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title={isVisible ? "Ocultar card" : "Mostrar card"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </CardHeader>
      
      <CardContent className="p-3">
        {showAnalysis ? (
          <div className="bg-gray-50 rounded-lg p-4 h-[220px] overflow-auto">
            <h4 className="font-medium text-gray-700 mb-2">Análise de dados</h4>
            <p className="text-gray-600 text-sm">{analysis}</p>
          </div>
        ) : (
          <div className="h-[220px]">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SortableGraphCard;
