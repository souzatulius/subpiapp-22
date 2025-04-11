
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOpenAIChartData = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateChartData = useCallback(async (
    chartType: string, 
    data: any[], 
    filters?: any
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Generating ${chartType} chart data with OpenAI`);
      
      const { data: responseData, error: supabaseError } = await supabase.functions.invoke('generate-chart-data', {
        body: { chartType, data, filters }
      });
      
      if (supabaseError) {
        throw new Error(supabaseError.message || 'Erro ao gerar dados do gráfico');
      }
      
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      
      console.log('OpenAI generated chart data:', responseData.chartData);
      return responseData.chartData;
    } catch (err: any) {
      console.error('Error generating chart data with OpenAI:', err);
      setError(err.message || 'Ocorreu um erro ao gerar os dados do gráfico');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateChartData,
    isGenerating,
    error,
  };
};
