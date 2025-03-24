
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useRankingData } from '@/hooks/ranking/useRankingData';
import { useExcelProcessor } from '@/hooks/ranking/useExcelProcessor';
import { FilterOptions, ChartVisibility } from './types';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import { toast } from 'sonner';

const RankingContent: React.FC = () => {
  const { user } = useAuth();
  const { processExcelFile } = useExcelProcessor();
  const {
    isLoading,
    ordensData,
    lastUpload,
    chartData,
    companies,
    districts,
    serviceTypes,
    statusTypes,
    fetchLastUpload,
    handleFileUpload,
    deleteLastUpload,
    applyFilters
  } = useRankingData(user);
  
  // Default filters
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos']
  });
  
  // Chart visibility settings
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    occurrences: true,
    resolutionTime: true,
    serviceTypes: true,
    neighborhoods: true,
    frequentServices: true,
    statusDistribution: true,
    statusTimeline: true,
    statusTransition: true,
    efficiencyRadar: true,
    criticalStatus: true,
    externalDistricts: true,
    servicesDiversity: true,
    timeToClose: true,
    dailyOrders: true
  });
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };
  
  // Handle chart visibility changes
  const handleChartVisibilityChange = (visibility: Partial<ChartVisibility>) => {
    setChartVisibility({ ...chartVisibility, ...visibility });
  };
  
  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      toast.loading('Processando planilha...');
      const uploadId = await processExcelFile(file, user);
      
      if (uploadId) {
        await fetchLastUpload();
        toast.success('Planilha carregada com sucesso!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao processar planilha. Por favor, tente novamente.');
    }
  };
  
  // Get a formatted upload info object for the UploadSection
  const getUploadInfo = () => {
    if (!lastUpload) return null;
    
    return {
      id: lastUpload.id,
      fileName: lastUpload.arquivo_nome,
      uploadDate: lastUpload.data_upload
    };
  };
  
  return (
    <div className="space-y-6">
      <UploadSection
        onUpload={handleUpload}
        lastUpload={getUploadInfo()}
        onDelete={deleteLastUpload}
        isLoading={isLoading}
        onRefresh={fetchLastUpload}
      />
      
      <FilterSection
        filters={filters}
        onFiltersChange={handleFilterChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
      />
      
      <ChartsSection
        chartData={chartData}
        isLoading={isLoading}
        chartVisibility={chartVisibility}
      />
    </div>
  );
};

export default RankingContent;
