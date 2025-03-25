
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useSGZData } from '@/hooks/ranking/useSGZData';
import SGZUploadSection from './sgz/SGZUploadSection';
import SGZFilters from './sgz/SGZFilters';
import SGZCharts from './sgz/SGZCharts';

const SGZContent = () => {
  const { user } = useAuth();
  
  const {
    lastUpload,
    isLoading,
    isUploading,
    uploadProgress,
    chartData,
    filters,
    handleFileUpload,
    deleteLastUpload,
    applyFilters,
    fetchLastUpload
  } = useSGZData(user);
  
  return (
    <div className="space-y-6">
      <SGZUploadSection 
        onUpload={handleFileUpload}
        lastUpload={lastUpload}
        onDelete={deleteLastUpload}
        isLoading={isLoading}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onRefresh={fetchLastUpload}
      />
      
      <SGZFilters 
        filters={filters}
        onFiltersChange={applyFilters}
        isLoading={isLoading}
      />
      
      <SGZCharts 
        data={chartData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SGZContent;
