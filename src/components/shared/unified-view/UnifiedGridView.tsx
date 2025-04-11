
import React from 'react';
import { Loader2 } from 'lucide-react';
import UnifiedEmptyState from './UnifiedEmptyState';

interface UnifiedGridViewProps<T> {
  items: T[];
  isLoading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyStateMessage?: string;
  emptyStateIcon?: React.ReactNode;
  loadingMessage?: string;
  onItemClick?: (item: T) => void;
  selectedItemId?: string;
  idExtractor: (item: T) => string;
  className?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

function UnifiedGridView<T>({
  items,
  isLoading,
  renderItem,
  emptyStateMessage = "Nenhum item encontrado",
  emptyStateIcon,
  loadingMessage = "Carregando itens...",
  className = "",
  onItemClick,
  selectedItemId,
  idExtractor,
  columns = { sm: 1, md: 2, lg: 3 }
}: UnifiedGridViewProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">{loadingMessage}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <UnifiedEmptyState 
        message={emptyStateMessage}
        icon={emptyStateIcon}
      />
    );
  }

  // Build grid columns classes based on the columns prop
  const gridColumnsClass = `grid-cols-${columns.sm || 1} md:grid-cols-${columns.md || 2} lg:grid-cols-${columns.lg || 3}`;

  return (
    <div className={`grid ${gridColumnsClass} gap-4 ${className}`}>
      {items.map((item, index) => {
        const id = idExtractor(item);
        return (
          <div 
            key={id} 
            onClick={() => onItemClick && onItemClick(item)}
            className={onItemClick ? "cursor-pointer" : ""}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}

export default UnifiedGridView;
