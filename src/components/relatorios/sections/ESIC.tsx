
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';
import { SortableChartCard } from '../components/SortableChartCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ESICProps {
  items: RelatorioItem[];
  isLoading: boolean;
  handleToggleVisibility: (itemId: string) => void;
  handleToggleAnalysis: (itemId: string) => void;
  handleToggleView: (itemId: string) => void;
}

const ESIC: React.FC<ESICProps> = ({
  items,
  isLoading,
  handleToggleVisibility,
  handleToggleAnalysis,
  handleToggleView
}) => {
  if (items.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-orange-600">
          Transparência e Acesso à Informação (e-SIC)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <SortableChartCard
                key={item.id}
                item={item}
                onToggleVisibility={handleToggleVisibility}
                onToggleAnalysis={handleToggleAnalysis}
                onToggleView={handleToggleView}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ESIC;
