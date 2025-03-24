
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { OS156Item, OS156FilterOptions } from '@/components/ranking/types';
import { useOS156Upload } from './useOS156Upload';
import { useChartDataGeneration } from './useChartDataGeneration';
import { useOS156Filters } from './useOS156Filters';

export const useOS156Data = (user: User | null) => {
  const [osData, setOsData] = useState<OS156Item[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  
  const { chartData, generateChartData } = useChartDataGeneration();
  
  const handleDataLoaded = useCallback((data: OS156Item[]) => {
    setOsData(data);
    
    // Extract companies
    if (data.length > 0) {
      const uniqueCompanies = Array.from(
        new Set(data.map(item => item.empresa).filter(Boolean) as string[])
      );
      setCompanies(uniqueCompanies);
    }
    
    // Generate charts
    generateChartData(data);
  }, [generateChartData]);
  
  const { 
    lastUpload, 
    isLoading, 
    fetchLastUpload, 
    handleFileUpload, 
    deleteLastUpload 
  } = useOS156Upload(user, handleDataLoaded);
  
  const { 
    filters, 
    setFilters, 
    applyFilters 
  } = useOS156Filters(osData, generateChartData);
  
  // Fetch data when component mounts or when user changes
  useEffect(() => {
    fetchLastUpload();
  }, [user, fetchLastUpload]);
  
  return {
    lastUpload,
    isLoading,
    osData,
    chartData,
    companies,
    filters,
    fetchLastUpload,
    handleFileUpload,
    deleteLastUpload,
    applyFilters: (newFilters: OS156FilterOptions) => {
      setFilters(newFilters);
      applyFilters(newFilters);
    }
  };
};
