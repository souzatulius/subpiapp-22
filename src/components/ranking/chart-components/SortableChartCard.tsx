
import React from 'react';
import { Eye, EyeOff, GripVertical, Search } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

export interface SortableChartCardProps {
  id: string;
  isVisible: boolean;
  component: React.ReactNode;
  title: string;
  analysis: string;
  isAnalysisExpanded?: boolean;
  showAnalysisOnly?: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
}

export const SortableChartCard: React.FC<SortableChartCardProps> = ({
  id,
  isVisible,
  component,
  title,
  analysis,
  isAnalysisExpanded,
  showAnalysisOnly,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="col-span-1 md:col-span-1 lg:col-span-1 h-full transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="relative h-full group">
        <div className="absolute top-0 right-0 p-1.5 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onToggleView}
            className="p-1 rounded-full bg-white text-gray-600 hover:text-orange-600 shadow-sm hover:shadow transition-all"
            title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar análise"}
          >
            <Search size={16} />
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1 rounded-full bg-white text-gray-600 hover:text-orange-600 shadow-sm hover:shadow transition-all"
            title={isVisible ? "Ocultar gráfico" : "Mostrar gráfico"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <div className="absolute top-1/2 left-0 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
          {...attributes}
          {...listeners}
        >
          <div className="p-1 rounded-full bg-white text-gray-400 shadow-sm">
            <GripVertical size={16} />
          </div>
        </div>
        
        <div className="h-full">
          {showAnalysisOnly ? (
            <div className="p-4 bg-white rounded-lg border border-orange-200 shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-medium text-orange-800 mb-2">{title} - Análise</h3>
              <p className="text-gray-700 flex-1 overflow-auto">{analysis}</p>
            </div>
          ) : (
            component
          )}
        </div>
        
        {/* Analysis text - conditionally shown based on isAnalysisExpanded flag */}
        {isAnalysisExpanded && !showAnalysisOnly && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700"
          >
            <h4 className="font-medium mb-1">{title} - Análise</h4>
            <p>{analysis}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SortableChartCard;
