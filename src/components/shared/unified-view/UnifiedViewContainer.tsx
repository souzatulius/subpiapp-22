
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UnifiedFilterBar, { FilterOption, ViewMode } from './UnifiedFilterBar';
import UnifiedListView from './UnifiedListView';
import UnifiedGridView from './UnifiedGridView';

interface UnifiedViewContainerProps<T> {
  items: T[];
  isLoading: boolean;
  renderListItem: (item: T, index: number) => React.ReactNode;
  renderGridItem: (item: T, index: number) => React.ReactNode;
  idExtractor: (item: T) => string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onItemClick?: (item: T) => void;
  selectedItemId?: string;
  filterOptions?: {
    primaryFilter?: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
      placeholder?: string;
    };
    secondaryFilter?: {
      value: string;
      onChange: (value: string) => void;
      options: FilterOption[];
      placeholder?: string;
    };
  };
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  hideViewToggle?: boolean;
  defaultViewMode?: ViewMode;
  cardContentClassName?: string;
  gridColumns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

function UnifiedViewContainer<T>({
  items,
  isLoading,
  renderListItem,
  renderGridItem,
  idExtractor,
  searchTerm,
  setSearchTerm,
  onItemClick,
  selectedItemId,
  filterOptions,
  emptyStateMessage,
  searchPlaceholder,
  className = "",
  showBackButton = false,
  onBack,
  hideViewToggle = false,
  defaultViewMode = 'list',
  cardContentClassName = "p-6",
  gridColumns
}: UnifiedViewContainerProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);

  return (
    <Card className={`border border-gray-200 shadow-sm rounded-xl overflow-hidden ${className}`}>
      <CardContent className={cardContentClassName}>
        <UnifiedFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterOptions={filterOptions}
          searchPlaceholder={searchPlaceholder}
          showBackButton={showBackButton}
          onBack={onBack}
          hideViewToggle={hideViewToggle}
          className="mb-6"
        />
        
        {viewMode === 'cards' ? (
          <UnifiedGridView
            items={items}
            isLoading={isLoading}
            renderItem={renderGridItem}
            idExtractor={idExtractor}
            onItemClick={onItemClick}
            selectedItemId={selectedItemId}
            emptyStateMessage={emptyStateMessage}
            columns={gridColumns}
          />
        ) : (
          <UnifiedListView
            items={items}
            isLoading={isLoading}
            renderItem={renderListItem}
            idExtractor={idExtractor}
            onItemClick={onItemClick}
            selectedItemId={selectedItemId}
            emptyStateMessage={emptyStateMessage}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default UnifiedViewContainer;
