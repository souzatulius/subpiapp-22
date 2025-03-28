
import React, { useState } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './filters/FilterSection';
import ActionsSection from './ActionsSection';
import FilterDialog from './filters/FilterDialog';
import ChartsSection from './ChartsSection';
import ChartCategorySection from './ChartCategorySection';
import DashboardCards from './insights/DashboardCards';
import { useChartItemsState } from './hooks/useChartItemsState';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { FilterOptions, ChartVisibility } from './types';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
}

const RankingContent: React.FC<RankingContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen
}) => {
  const { user } = useAuth();
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [dadosSGZ, setDadosSGZ] = useState<any[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { 
    filters, 
    chartVisibility, 
    handleFiltersChange, 
    handleChartVisibilityChange, 
    resetFilters 
  } = useFilterManagement();

  const { chartItems, setChartItems } = useChartItemsState();

  const handleUploadComplete = (id: string, data: any[]) => {
    setUploadId(id);
    setDadosSGZ(data);
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  return (
    <div className="space-y-6">
      <UploadSection 
        onUploadStart={handleUploadStart}
        onUploadComplete={handleUploadComplete}
        isUploading={isUploading}
        user={user}
      />
      
      {dadosSGZ && dadosSGZ.length > 0 && (
        <DashboardCards dadosPlanilha={dadosSGZ} uploadId={uploadId || undefined} />
      )}

      <FilterSection 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
      />
      
      <ChartCategorySection 
        activeCategory="all"
        onCategoryChange={(category) => {}}
        categories={['all', 'trends', 'performance', 'distribution']}
      />
      
      <ChartsSection 
        chartData={{}}
        isLoading={false}
        chartVisibility={chartVisibility}
      />
      
      <ActionsSection />
      
      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
        onResetFilters={resetFilters}
      />
    </div>
  );
};

export default RankingContent;
