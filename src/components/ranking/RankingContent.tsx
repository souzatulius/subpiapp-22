
import React, { useState } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ActionsSection from './ActionsSection';
import FilterDialog from './filters/FilterDialog';
import ChartsSection from './ChartsSection';
import ChartCategorySection from './ChartCategorySection';
import DashboardCards from './insights/DashboardCards';
import { ChartVisibility, FilterOptions } from './types';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { BarChart3 } from 'lucide-react';

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
  const [activeCategory, setActiveCategory] = useState("all");

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

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section with themed border */}
      <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload de Planilhas
        </h2>
        <UploadSection 
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
          isUploading={isUploading}
          user={user}
        />
      </div>
      
      {/* AI Insights Cards Section */}
      {dadosSGZ && dadosSGZ.length > 0 && (
        <div className="p-4 bg-white border border-orange-200 rounded-lg shadow-sm">
          <DashboardCards dadosPlanilha={dadosSGZ} uploadId={uploadId || undefined} />
        </div>
      )}

      {/* Filters Section */}
      <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
        <FilterSection 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          chartVisibility={chartVisibility}
          onChartVisibilityChange={handleChartVisibilityChange}
        />
      </div>
      
      {/* Chart Categories Section */}
      <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
        <ChartCategorySection 
          activeCategory={activeCategory}
          onCategoryChange={(category) => setActiveCategory(category)}
          categories={['all', 'trends', 'performance', 'distribution']}
        />
      </div>
      
      {/* Charts Section */}
      <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Gráficos e Comparações
        </h2>
        <ChartsSection 
          chartData={{}}
          isLoading={false}
          chartVisibility={chartVisibility}
        />
      </div>
      
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
