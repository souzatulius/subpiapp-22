
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { OrdemServico, PlanilhaUpload, OS156Item } from '@/components/ranking/types';
import { useChartDataGeneration } from './useChartDataGeneration';
import { useDataFetcher } from './useDataFetcher';
import { useUploadHandler } from './useUploadHandler';
import { useFilterHandler } from './useFilterHandler';

export const useRankingData = (user: User | null, setUploadProgress?: (progress: number) => void) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ordensData, setOrdensData] = useState<OrdemServico[]>([]);
  const [lastUpload, setLastUpload] = useState<PlanilhaUpload | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  
  const { chartData, generateChartData } = useChartDataGeneration();
  
  // Initialize our modular hooks
  const { fetchLastUpload, fetchOrdersData } = useDataFetcher(
    user,
    setIsLoading,
    setOrdensData,
    setLastUpload,
    setCompanies,
    setDistricts,
    setServiceTypes,
    setStatusTypes,
    generateChartData
  );
  
  const { handleFileUpload: uploadFile, deleteLastUpload: removeLastUpload } = useUploadHandler(
    user,
    setIsLoading,
    setLastUpload,
    fetchOrdersData,
    setUploadProgress
  );
  
  const { applyFilters } = useFilterHandler(ordensData, generateChartData);
  
  // Wrapper functions to maintain the original API
  const handleFileUpload = async (file: File) => {
    await uploadFile(file);
  };
  
  const deleteLastUpload = async () => {
    await removeLastUpload(lastUpload, generateChartData);
    setOrdensData([]);
  };
  
  // Fetch data when component mounts or when user changes
  useEffect(() => {
    fetchLastUpload();
  }, [user, fetchLastUpload]);
  
  return {
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
  };
};
