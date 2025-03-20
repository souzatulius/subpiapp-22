
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
    setChartData,
    updateChartData
  } = useChartData(ordens, stats);
  
  // File upload functionalities
  const { 
    loading: uploadLoading, 
    uploadExcel: uploadExcelOriginal, 
    downloadExcel
  } = useFileUpload(handleUploadSuccess);

  // Callback for when an upload is successful
  function handleUploadSuccess(inserted: number, updated: number) {
    console.log(`Upload success: ${inserted} inserted, ${updated} updated`);
    // Fetch upload logs and refresh data
    fetchUploadLogs();
    fetchOrdens();
  }

  // Wrapper for uploadExcel to handle the new success callback
  const uploadExcel = useCallback(async (file: File) => {
    return await uploadExcelOriginal(file);
  }, [uploadExcelOriginal]);

  // Apply filters and fetch orders
  const applyFilters = useCallback((newFilters: ChartFilters) => {
    // Remove any _all values which mean "all items selected"
    const cleanedFilters: ChartFilters = {};
    
    for (const [key, value] of Object.entries(newFilters)) {
      if (value !== '_all' && value !== null && value !== undefined) {
        cleanedFilters[key as keyof ChartFilters] = value;
      }
    }
    
    setFilters(cleanedFilters);
    
    // Automatically update when filters are applied
    setTimeout(() => {
      fetchOrdens();
    }, 100);
  }, [setFilters, fetchOrdens]);

  // Update the UI with fresh chart data
  const updateDashboard = useCallback(() => {
    fetchOrdens();
    calculateStats();
    updateChartData();
  }, [fetchOrdens, calculateStats, updateChartData]);

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
    updateDashboard
  };
};

export default useOrdensServico;
