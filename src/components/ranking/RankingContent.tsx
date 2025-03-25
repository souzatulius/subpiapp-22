
import React, { useEffect } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import ActionsSection from './ActionsSection';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useChartData } from '@/hooks/ranking/useChartData';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, FileSpreadsheet, BarChart3 } from 'lucide-react';

const RankingContent = () => {
  const {
    user
  } = useAuth();
  const {
    lastUpload,
    isLoading: isUploadLoading,
    uploads,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  } = useUploadManagement(user);
  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  } = useFilterManagement();
  const {
    chartData,
    isLoading: isChartLoading,
    lastUpdate,
    refreshData
  } = useChartData(filters);

  // Combined loading state
  const isLoading = isUploadLoading || isChartLoading;
  
  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user, fetchLastUpload]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-orange-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Dashboard SGZ - Indicadores de Zeladoria
          </h2>
          <p className="text-sm text-orange-700">
            Análise completa das ordens de serviço do SGZ (Sistema de Gestão da Zeladoria) para acompanhamento 
            dos distritos da Subprefeitura de Pinheiros.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          {lastUpdate && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-orange-700 bg-orange-50 border-orange-200">
              <CalendarClock className="w-4 h-4" />
              <span>Última atualização: {lastUpdate}</span>
            </Badge>
          )}
          
          {lastUpload && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-orange-700 bg-orange-50 border-orange-200">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Planilha: {lastUpload.fileName}</span>
            </Badge>
          )}
        </div>
      </div>
      
      <UploadSection 
        onUpload={handleUpload} 
        lastUpload={lastUpload} 
        onDelete={handleDeleteUpload} 
        isLoading={isLoading}
        onRefreshCharts={refreshData}
        uploads={uploads}
      />
      
      <FilterSection 
        filters={filters} 
        onFiltersChange={handleFiltersChange} 
        chartVisibility={chartVisibility} 
        onChartVisibilityChange={handleChartVisibilityChange} 
      />
      
      <ChartsSection 
        chartData={chartData} 
        isLoading={isLoading} 
        chartVisibility={chartVisibility} 
      />
      
      <ActionsSection />
    </div>
  );
};

export default RankingContent;
