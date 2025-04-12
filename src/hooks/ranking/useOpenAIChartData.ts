
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ZeladoriaChartData } from '@/types/ZeladoriaChartData';

interface UseOpenAIChartDataReturn {
  generateChartData: (chartType: string, data: any[]) => Promise<ZeladoriaChartData>;
  isGenerating: boolean;
  error: Error | null;
}

export function useOpenAIChartData(): UseOpenAIChartDataReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateChartData = async (chartType: string, data: any[]): Promise<ZeladoriaChartData> => {
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
      
      return responseData.chartData as ZeladoriaChartData;
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
