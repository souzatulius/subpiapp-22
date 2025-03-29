
import React, { useState } from 'react';
import UploadSection from './UploadSection';
import FilterDialog from './filters/FilterDialog';
import { ChartVisibility, FilterOptions } from './types';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card } from '@/components/ui/card';
import RankingCharts from './RankingCharts';
import DashboardCards from './insights/DashboardCards';

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
  const [dadosPainel, setDadosPainel] = useState<any[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const { 
    filters, 
    chartVisibility, 
    handleFiltersChange, 
    handleChartVisibilityChange, 
    resetFilters 
  } = useFilterManagement();

  const handleUploadComplete = (id: string, data: any[]) => {
    setUploadId(id);
    setDadosSGZ(data);
    setIsUploading(false);
  };

  const handlePainelUploadComplete = (id: string, data: any[]) => {
    setDadosPainel(data);
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };
  
  const handleSimulateIdealRanking = () => {
    setIsSimulationActive(!isSimulationActive);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section with themed border */}
      <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
        <h2 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload de Planilhas
        </h2>
        <UploadSection 
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
          onPainelUploadComplete={handlePainelUploadComplete}
          isUploading={isUploading}
          user={user}
        />
      </Card>
      
      {/* AI Insights Cards Section */}
      {dadosSGZ && dadosSGZ.length > 0 && (
        <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
          <DashboardCards 
            dadosPlanilha={dadosSGZ} 
            dadosPainel={dadosPainel}
            uploadId={uploadId || undefined} 
            isSimulationActive={isSimulationActive}
          />
        </Card>
      )}

      {/* Charts Section */}
      {dadosSGZ && dadosSGZ.length > 0 && (
        <RankingCharts 
          sgzData={dadosSGZ}
          painelData={dadosPainel}
          isLoading={isUploading}
          chartVisibility={chartVisibility}
          isSimulationActive={isSimulationActive}
          onSimulateIdealRanking={handleSimulateIdealRanking}
        />
      )}
      
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
