
import React, { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useSGZUploadManagement } from '@/hooks/ranking/useSGZUploadManagement';
import { useSGZFilterManagement } from '@/hooks/ranking/useSGZFilterManagement';
import { useSGZChartData } from '@/hooks/ranking/useSGZChartData';
import SGZUploadSection from './sgz/SGZUploadSection';
import SGZFilterSection from './sgz/SGZFilterSection';
import SGZChartsSection from './sgz/SGZChartsSection';
import SGZActionsSection from './sgz/SGZActionsSection';

interface SGZContentProps {
  user: User | null;
}

const SGZContent: React.FC<SGZContentProps> = ({ user }) => {
  const {
    lastUpload,
    isLoading: isUploadLoading,
    uploadProgress,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload,
    resetUploadProgress
  } = useSGZUploadManagement(user);

  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  } = useSGZFilterManagement();

  const {
    chartData,
    isLoading: isChartLoading,
    fetchChartData
  } = useSGZChartData(filters);

  // Combined loading state
  const isLoading = isUploadLoading || isChartLoading;

  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user]);

  useEffect(() => {
    if (lastUpload) {
      fetchChartData(lastUpload.id);
    }
  }, [lastUpload]);

  return (
    <div className="space-y-6">
      <SGZUploadSection 
        onUpload={handleUpload} 
        lastUpload={lastUpload} 
        onDelete={handleDeleteUpload} 
        isLoading={isLoading} 
        uploadProgress={uploadProgress}
        resetProgress={resetUploadProgress}
      />
      
      {lastUpload && (
        <>
          <SGZFilterSection 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
            chartVisibility={chartVisibility} 
            onChartVisibilityChange={handleChartVisibilityChange} 
          />
          
          <SGZChartsSection 
            chartData={chartData} 
            isLoading={isChartLoading} 
            chartVisibility={chartVisibility} 
          />
          
          <SGZActionsSection />
        </>
      )}
    </div>
  );
};

export default SGZContent;
