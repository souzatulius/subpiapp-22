
import React, { useState } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ActionsSection from './ActionsSection';
import FilterDialog from './filters/FilterDialog';
import ChartsSection from './ChartsSection';
import ChartCategorySection from './ChartCategorySection';
import DashboardCards from './insights/DashboardCards';
import { useChartItemsState } from './hooks/useChartItemsState';
import { useAuth } from '@/hooks/useSupabaseAuth';

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
    chartItems,
    setChartItems,
    visibleChartIds,
    setVisibleChartIds,
    activeCategory,
    setActiveCategory,
    categories,
    visibleChartItems
  } = useChartItemsState();

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
        setFilterDialogOpen={setFilterDialogOpen} 
        visibleChartIds={visibleChartIds}
        chartItems={chartItems}
      />
      
      <ChartCategorySection 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      
      <ChartsSection 
        chartItems={visibleChartItems} 
        setChartItems={setChartItems} 
        uploadId={uploadId}
        dadosSGZ={dadosSGZ}
      />
      
      <ActionsSection />
      
      <FilterDialog 
        open={filterDialogOpen} 
        setOpen={setFilterDialogOpen}
        chartItems={chartItems}
        visibleChartIds={visibleChartIds}
        setVisibleChartIds={setVisibleChartIds}
      />
    </div>
  );
};

export default RankingContent;
