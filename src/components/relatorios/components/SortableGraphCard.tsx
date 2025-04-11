
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeOff, Search, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SortableGraphCardProps {
  id: string;
  title: string;
  value?: string | number;
  description?: string;
  isVisible: boolean;
  showAnalysis: boolean;
  analysis?: string;
  isLoading?: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  onExport?: () => void;
  hideMenuIcon?: boolean;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
  children: React.ReactNode;
}

const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  value,
  description,
  isVisible,
  showAnalysis,
  analysis = "Análise de dados não disponível para este gráfico.",
  isLoading = false,
  onToggleVisibility,
  onToggleAnalysis,
  onExport,
  hideMenuIcon = false,
  dataSource,
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
  
  // Generate badge color based on data source
  const getBadgeColor = (source?: string) => {
    if (!source) return 'bg-gray-200 text-gray-700';
    
    switch(source?.toLowerCase()) {
      case 'sgz':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'painel da zeladoria':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
      
      {/* Control buttons */}
      <div className="absolute top-3 right-3 flex space-x-2">
        {onToggleAnalysis && (
          <button
            onClick={onToggleAnalysis}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title={showAnalysis ? "Mostrar gráfico" : "Mostrar análise"}
          >
            <Search size={16} />
          </button>
        )}
        
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title="Ocultar card"
          >
            <EyeOff size={16} />
          </button>
        )}
      </div>
      
      <CardHeader className="pb-1 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          
          {dataSource && (
            <Badge 
              variant="outline" 
              className={`text-xs py-0 px-1.5 ml-2 ${getBadgeColor(dataSource)}`}
            >
              {dataSource}
            </Badge>
          )}
        </div>
        
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
