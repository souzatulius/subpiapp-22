
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ZeladoriaChartData } from '@/types/ZeladoriaChartData';

// Define the extended chart data structure that includes visualization properties
interface ExtendedChartData extends ZeladoriaChartData {
  labels?: string[];
  data?: number[];
  analysis?: string;
}

interface UseOpenAIChartDataReturn {
  generateChartData: (chartType: string, data: any[]) => Promise<ExtendedChartData>;
  isGenerating: boolean;
  error: Error | null;
}

export function useOpenAIChartData(): UseOpenAIChartDataReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateChartData = async (chartType: string, data: any[]): Promise<ExtendedChartData> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data: responseData, error: apiError } = await supabase.functions.invoke('generate-chart-data', {
        body: {
          chartType,
          data
        }
      });
      
      if (apiError) {
        throw new Error(`API Error: ${apiError.message}`);
      }
      
      if (!responseData || !responseData.chartData) {
        throw new Error('Invalid response format from chart generation API');
      }
      
      // Create extended chart data with visualization properties
      const chartData = responseData.chartData as ZeladoriaChartData;
      const extendedChartData: ExtendedChartData = {...chartData};
      
      // Add visualization properties based on chartType
      if (chartType === 'statusDistribution') {
        // For status distribution chart, use por_status data
        extendedChartData.labels = Object.keys(chartData.por_status);
        extendedChartData.data = Object.values(chartData.por_status);
        extendedChartData.analysis = 'Distribuição de status das ordens de serviço mostra a proporção de cada estado no sistema.';
      } else if (chartType === 'districtDistribution') {
        // For district distribution chart, use por_distrito data
        extendedChartData.labels = Object.keys(chartData.por_distrito);
        extendedChartData.data = Object.values(chartData.por_distrito);
        extendedChartData.analysis = 'Distribuição por distrito mostra quais áreas têm maior volume de ordens de serviço.';
      } else if (chartType === 'serviceDiversity') {
        // For service diversity chart, use por_tipo_servico_agrupado data
        extendedChartData.labels = Object.keys(chartData.por_tipo_servico_agrupado);
        extendedChartData.data = Object.values(chartData.por_tipo_servico_agrupado);
        extendedChartData.analysis = 'Os tipos de serviço mais frequentes dão uma visão dos principais problemas da cidade.';
      }
      
      return extendedChartData;
    } catch (err: any) {
      console.error('Error generating chart data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateChartData,
    isGenerating,
    error
  };
}
