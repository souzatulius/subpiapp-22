
import { ZeladoriaChartData } from '@/types/ZeladoriaChartData';

/**
 * Generates chart-ready data from status information
 */
export function generateChartDataFromStatus(statusData: Record<string, number> | undefined) {
  if (!statusData) {
    console.warn('generateChartDataFromStatus: No status data provided');
    return { labels: [], data: [] };
  }

  // Sort statuses by count (descending)
  const sortedEntries = Object.entries(statusData)
    .sort(([, countA], [, countB]) => countB - countA);

  return {
    labels: sortedEntries.map(([status]) => status),
    data: sortedEntries.map(([, count]) => count)
  };
}

/**
 * Generates chart-ready data from district information
 */
export function generateChartDataFromDistrict(districtData: Record<string, number> | undefined) {
  if (!districtData) {
    console.warn('generateChartDataFromDistrict: No district data provided');
    return { labels: [], data: [] };
  }

  // Sort districts by count (descending)
  const sortedEntries = Object.entries(districtData)
    .sort(([, countA], [, countB]) => countB - countA);

  return {
    labels: sortedEntries.map(([district]) => district),
    data: sortedEntries.map(([, count]) => count)
  };
}

/**
 * Creates a chart data object compatible with Chart.js
 */
export function createChartDataObject(
  labels: string[], 
  data: number[], 
  backgroundColor: string[] = []
) {
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: backgroundColor.length > 0 
        ? backgroundColor 
        : Array(data.length).fill('#4C51BF'),
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };
}

/**
 * Creates a debug component to visualize the Zeladoria data
 */
export function createDebugDataString(data: ZeladoriaChartData | null) {
  if (!data) return "No data available";
  
  return JSON.stringify({
    kpis_summary: {
      total_os: data.kpis.total_os,
      fechadas: data.kpis.os_fechadas,
      pendentes: data.kpis.os_pendentes
    },
    distritos_count: Object.keys(data.por_distrito).length,
    status_count: Object.keys(data.por_status).length,
    servicos_count: Object.keys(data.por_tipo_servico_agrupado).length
  }, null, 2);
}
