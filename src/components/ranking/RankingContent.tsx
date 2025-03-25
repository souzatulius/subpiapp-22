
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
import { CalendarClock } from 'lucide-react';

const RankingContent = () => {
  const {
    user
  } = useAuth();
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
  const {
    chartData,
    isLoading: isChartLoading,
    lastUpdate
  } = useChartData(filters);

  // Combined loading state
  const isLoading = isUploadLoading || isChartLoading;
  
  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user]);
  
  return (
    <div className="space-y-6">
      {lastUpdate && (
        <div className="flex items-center">
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-orange-700 bg-orange-50 border-orange-200">
            <CalendarClock className="w-4 h-4" />
            <span>Última atualização: {lastUpdate}</span>
          </Badge>
        </div>
      )}
      
      <UploadSection onUpload={handleUpload} lastUpload={lastUpload} onDelete={handleDeleteUpload} isLoading={isLoading} />
      
      <FilterSection filters={filters} onFiltersChange={handleFiltersChange} chartVisibility={chartVisibility} onChartVisibilityChange={handleChartVisibilityChange} />
      
      <ChartsSection chartData={chartData} isLoading={isLoading} chartVisibility={chartVisibility} />
      
      <ActionsSection />
    </div>
  );
};

export default RankingContent;
