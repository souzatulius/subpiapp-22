
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import { ChartVisibility, FilterOptions } from './types';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';

// Dummy chart data for preview purposes (until real data is loaded)
import { generateDummyChartData } from './utils/dummyData';

const RankingContent: React.FC = () => {
  const { user } = useAuth();
  const {
    lastUpload,
    isLoading,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  } = useUploadManagement(user);

  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos']
  });

  // State for which charts are visible
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

  // Fetch data on component mount
  useEffect(() => {
    fetchLastUpload();
  }, [fetchLastUpload]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  // Handle chart visibility changes
  const handleChartVisibilityChange = (visibility: Partial<ChartVisibility>) => {
    setChartVisibility(prevVisibility => ({
      ...prevVisibility,
      ...visibility
    }));
  };

  // For now, use dummy data
  const chartData = generateDummyChartData();

  return (
    <div className="space-y-6">
      <UploadSection
        onUpload={handleUpload}
        lastUpload={lastUpload}
        onDelete={handleDeleteUpload}
        isLoading={isLoading}
        onRefresh={() => fetchLastUpload()}
      />
      
      <FilterSection 
        filters={filters}
        onFiltersChange={handleFilterChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Here we would render chart components based on chartVisibility state */}
        {/* For example: */}
        {chartVisibility.statusDistribution && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Distribuição por Status</h3>
            <p className="text-gray-500">
              Faça upload de uma planilha para visualizar os dados
            </p>
          </div>
        )}

        {chartVisibility.statusTimeline && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Evolução Temporal</h3>
            <p className="text-gray-500">
              Faça upload de uma planilha para visualizar os dados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingContent;
