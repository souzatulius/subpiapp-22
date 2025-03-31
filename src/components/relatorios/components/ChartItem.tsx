
import React from 'react';
import { RelatorioCard } from './RelatorioCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search } from 'lucide-react';

interface ChartItemProps {
  id: string;
  title: string;
  value?: string | number;
  description?: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis?: string;
  isAnalysisExpanded?: boolean;
  showAnalysisOnly?: boolean;
  isLoading?: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
}

const ChartItem: React.FC<ChartItemProps> = ({
  id,
  title,
  value,
  description,
  component,
  isVisible,
  analysis,
  isAnalysisExpanded,
  showAnalysisOnly,
  isLoading,
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
      className="col-span-1 h-full transition-all duration-300 cursor-move"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      {...attributes}
      {...listeners}
    >
      <div className="relative h-full group">
        <div className="absolute top-0 right-0 p-1.5 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {analysis && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleView();
              }}
              className="p-1 rounded-full bg-white text-orange-600 hover:text-orange-800 shadow-sm hover:shadow transition-all"
              title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar análise"}
            >
              <Search size={16} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-1 rounded-full bg-white text-orange-600 hover:text-orange-800 shadow-sm hover:shadow transition-all"
            title={isVisible ? "Ocultar gráfico" : "Mostrar gráfico"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <div className="h-full">
          {showAnalysisOnly && analysis ? (
            <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border border-orange-300 shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-medium text-orange-800 mb-2">{title} - Análise</h3>
              <p className="text-orange-700 flex-1 overflow-auto">{analysis}</p>
            </div>
          ) : (
            <RelatorioCard 
              title={title} 
              description={description}
              className=""
              value={value}
              isLoading={isLoading}
              analysis={analysis}
            >
              {component}
            </RelatorioCard>
          )}
        </div>
        
        {isAnalysisExpanded && !showAnalysisOnly && analysis && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-2 p-3 bg-orange-100 rounded-md text-sm text-orange-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-medium mb-1">{title} - Análise</h4>
            <p>{analysis}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChartItem;
