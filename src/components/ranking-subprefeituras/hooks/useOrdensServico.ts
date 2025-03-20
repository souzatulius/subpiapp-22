
import { useCallback } from 'react';
import { useOrdensData } from './useOrdensData';
import { useOrdensStats } from './useOrdensStats';
import { useChartData } from './useChartData';
import { useFileUpload } from './useFileUpload';
import { useUploadLogs } from './useUploadLogs';
import { ChartFilters } from '../types';

/**
 * Main hook that combines all order service functionality
 * This hook coordinates the interaction between the other specialized hooks
 */
const useOrdensServico = () => {
  // Get orders data with filtering
  const { 
    ordens, 
    loading: ordensLoading, 
    filters, 
    setFilters, 
    fetchOrdens 
  } = useOrdensData();
  
  // Get upload logs
  const { 
    uploadLogs, 
    loading: logsLoading, 
    fetchUploadLogs 
  } = useUploadLogs();
  
  // Calculate statistics based on orders
  const { 
    stats, 
    loading: statsLoading,
    calculateStats
  } = useOrdensStats(ordens);
  
  // Generate chart data based on statistics and orders
  const { 
    chartData, 
    setChartData 
  } = useChartData(ordens, stats);
  
  // File upload functionalities
  const { 
    loading: uploadLoading, 
    uploadExcel, 
    downloadExcel, 
    downloadUploadedFile, 
    uploadFile 
  } = useFileUpload(handleUploadSuccess);

  // Callback for when an upload is successful
  function handleUploadSuccess() {
    fetchOrdens();
    fetchUploadLogs();
  }

  // Apply filters and fetch orders
  const applyFilters = useCallback((newFilters: ChartFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Determine loading state
  const loading = ordensLoading || logsLoading || statsLoading || uploadLoading;

  return {
    ordens,
    loading,
    uploadLogs,
    chartData,
    setChartData,
    stats,
    filters,
    setFilters: applyFilters,
    fetchOrdens,
    uploadExcel,
    calculateStats,
    downloadExcel,
    downloadUploadedFile,
    uploadFile
  };
};

export default useOrdensServico;
