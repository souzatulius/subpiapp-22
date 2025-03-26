
import React, { useEffect, useState } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import ActionsSection from './ActionsSection';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useChartData } from '@/hooks/ranking/useChartData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, FileSpreadsheet, BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const RankingContent = () => {
  const { user } = useAuth();
  const {
    lastUpload,
    isLoading: isUploadLoading,
    uploads,
    uploadProgress,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  } = useUploadManagement(user);
  
  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    resetFilters  // Added reset functionality
  } = useFilterManagement();
  
  const {
    chartData,
    isLoading: isChartLoading,
    lastUpdate,
    chartLoadingProgress,
    refreshData,
    ordensCount
  } = useChartData(filters);

  // Track if an upload just happened to trigger filter reset
  const [justUploaded, setJustUploaded] = useState(false);

  // Combined loading state
  const isLoading = isUploadLoading || isChartLoading;
  
  // Custom upload handler that resets filters
  const handleUploadWithReset = async (file: File) => {
    await handleUpload(file);
    setJustUploaded(true);
  };
  
  // Handle refresh with filter reset
  const handleRefreshWithReset = () => {
    resetFilters();
    refreshData();
    toast.success('Filtros redefinidos e dados atualizados');
  };
  
  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user, fetchLastUpload]);
  
  // After upload completes, refresh chart data and reset filters if needed
  useEffect(() => {
    if (justUploaded && !isUploadLoading) {
      resetFilters(); // Reset filters after upload
      refreshData(); // Refresh chart data
      setJustUploaded(false);
      toast.success('Dados atualizados e filtros redefinidos');
    }
  }, [justUploaded, isUploadLoading, resetFilters, refreshData]);
  
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
          
          {ordensCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-orange-700 bg-orange-50 border-orange-200">
              <span>Ordens carregadas: {ordensCount}</span>
            </Badge>
          )}
        </div>
      </div>
      
      {/* Reset filters button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshWithReset}
          className="text-orange-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Redefinir filtros e atualizar
        </Button>
      </div>
      
      {/* Chart loading progress indicator */}
      {isChartLoading && chartLoadingProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Atualizando gráficos...</span>
            <span>{chartLoadingProgress}%</span>
          </div>
          <Progress value={chartLoadingProgress} className="h-2" />
        </div>
      )}
      
      <UploadSection 
        onUpload={handleUploadWithReset}
        lastUpload={lastUpload} 
        onDelete={handleDeleteUpload} 
        isLoading={isLoading}
        onRefreshCharts={refreshData}
        uploads={uploads}
        uploadProgress={uploadProgress}
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
