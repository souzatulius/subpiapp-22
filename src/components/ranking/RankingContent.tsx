
import React, { useEffect } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import ActionsSection from './ActionsSection';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useChartData } from '@/hooks/ranking/useChartData';

const RankingContent = () => {
  const { user } = useAuth();
  const { 
    lastUpload, 
    isLoading: isUploadLoading, 
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
  
  const { chartData, isLoading: isChartLoading } = useChartData(filters);
  
  // Combined loading state
  const isLoading = isUploadLoading || isChartLoading;

  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ranking das Subs</h1>
      
      <UploadSection 
        onUpload={handleUpload} 
        lastUpload={lastUpload} 
        onDelete={handleDeleteUpload}
        isLoading={isLoading}
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
