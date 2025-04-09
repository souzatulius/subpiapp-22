
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Search, GripVertical } from 'lucide-react';

interface SortableGraphCardProps {
  id: string;
  title: string;
  value?: string | number; // Added value for the number field
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
  value, // Added value for the number field
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
  
  // Format value - replace dot with comma for decimal numbers
  const formatDisplayValue = (val?: string | number): string => {
    if (val === undefined) return '';
    const stringVal = val.toString();
    return stringVal.replace('.', ',');
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
            title="Ocultar card"
          >
            <EyeOff size={16} />
          </button>
        )}
      </div>
      
      <CardHeader className="pb-1 pt-3 px-4">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {value !== undefined && (
          <p className="text-2xl font-bold text-blue-700">{formatDisplayValue(value)}</p>
        )}
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </CardHeader>
      
      <CardContent className="p-3 pt-1">
        {showAnalysis ? (
          <div className="bg-gray-50 rounded-lg p-4 h-[200px] overflow-auto">
            <h4 className="font-medium text-gray-700 mb-2">Análise de dados</h4>
            <p className="text-gray-600 text-sm">{analysis}</p>
          </div>
        ) : (
          <div className="h-[200px]">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SortableGraphCard;
