
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
import { CalendarClock, FileSpreadsheet, BarChart3, RefreshCw, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FilterDialog from './filters/FilterDialog';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RankingContent: React.FC<RankingContentProps> = ({ filterDialogOpen, setFilterDialogOpen }) => {
  const {
    user
  } = useAuth();
  const {
    lastUpload,
    isLoading: isUploadLoading,
    uploads,
    uploadProgress,
    processingStats,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  } = useUploadManagement(user);
  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    resetFilters,
    isModified
  } = useFilterManagement();
  const {
    chartData,
    isLoading: isChartLoading,
    lastUpdate,
    chartLoadingProgress,
    fetchError,
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
      console.log('Upload completed, resetting filters and refreshing data');
      resetFilters(); // Reset filters after upload
      refreshData(); // Refresh chart data
      setJustUploaded(false);

      // Show success message based on processing stats
      if (processingStats.processingStatus === 'success') {
        toast.success(`Dados atualizados e filtros redefinidos. ${processingStats.newOrders} ordens inseridas e ${processingStats.updatedOrders} atualizadas.`);
      }
    }
  }, [justUploaded, isUploadLoading, resetFilters, refreshData, processingStats]);
  
  return (
    <div className="space-y-6">
      {/* Error display */}
      {fetchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}
      
      {/* Upload progress indicator */}
      {isUploadLoading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Carregando planilha...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
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
        processingStats={processingStats}
      />
      
      {/* Filter dialog */}
      <FilterDialog 
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
        onResetFilters={resetFilters}
      />
      
      <ChartsSection chartData={chartData} isLoading={isLoading} chartVisibility={chartVisibility} />
      
      <ActionsSection />
    </div>
  );
};

export default RankingContent;
