
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRankingCharts } from './useRankingCharts';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from './useUploadState';
import { compararBases } from './utils/compararBases';

export const useChartRefresher = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { 
    setSgzData,
    setPlanilhaData, 
    setPainelData,
    setIsLoading,
    setIsChartsLoading,
    setInsightsProgress,
    setChartsProgress,
    setUploadId
  } = useRankingCharts();

  const { showFeedback, updateFeedbackProgress } = useAnimatedFeedback();
  const { setLastRefreshTime } = useUploadState();

  /**
   * Refresh all chart data and trigger insight generation
   */
  const refreshAllChartData = async () => {
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      setIsChartsLoading(true);
      setInsightsProgress(10);
      setChartsProgress(10);
      
      showFeedback('loading', 'Atualizando dados...', {
        duration: 0,
        progress: 10,
        stage: 'Buscando dados mais recentes'
      });

      // Step 1: Get the latest SGZ data
      updateFeedbackProgress(20, 'Obtendo dados do SGZ...');
      const { data: sgzData, error: sgzError } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .order('sgz_criado_em', { ascending: false })
        .limit(1000);

      if (sgzError) {
        console.error("Error fetching SGZ data:", sgzError);
        throw sgzError;
      }

      console.log(`Retrieved ${sgzData?.length || 0} SGZ records`);

      // Step 2: Get the latest Painel data
      updateFeedbackProgress(40, 'Obtendo dados do Painel...');
      const { data: painelData, error: painelError } = await supabase
        .from('painel_zeladoria_dados')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (painelError) {
        console.error("Error fetching Painel data:", painelError);
        throw painelError;
      }

      console.log(`Retrieved ${painelData?.length || 0} Painel records`);

      // Step 3: Set data in store
      setSgzData(sgzData || []);
      setPlanilhaData(sgzData || []);  // planilhaData is an alias for sgzData
      setPainelData(painelData || []);

      updateFeedbackProgress(60, 'Gerando insights...');

      // Step 4: Compare data for basic verification
      if ((sgzData && sgzData.length > 0) && (painelData && painelData.length > 0)) {
        const comparacao = compararBases(sgzData, painelData);
        console.log("Data comparison results:", {
          totalDivergencias: comparacao.divergencias.length,
          totalAusentes: comparacao.ausentes.length,
          divergenciasStatus: comparacao.divergenciasStatus.length
        });
      }

      // Step 5: Check if we have valid data for insights
      if ((sgzData && sgzData.length > 0) || (painelData && painelData.length > 0)) {
        try {
          // Get the most recent upload ID for insights association
          const { data: uploadData } = await supabase
            .from('painel_zeladoria_uploads')
            .select('id')
            .order('data_upload', { ascending: false })
            .limit(1);

          const uploadId = uploadData && uploadData.length > 0 ? uploadData[0].id : null;
          
          if (uploadId) {
            console.log(`Found latest upload ID: ${uploadId}`);
            setUploadId(uploadId);
            
            // Check if we already have insights for this upload
            const { data: existingInsights } = await supabase
              .from('painel_zeladoria_insights')
              .select('*')
              .eq('painel_id', uploadId)
              .maybeSingle();

            // If no insights yet, generate them
            if (!existingInsights) {
              console.log("No existing insights, generating new ones...");
              updateFeedbackProgress(75, 'Analisando dados com IA...');
              
              try {
                const result = await generateInsights({
                  sgz_data: sgzData || [],
                  painel_data: painelData || [],
                  upload_id: uploadId
                });
                
                console.log("Insights generation result:", result?.insights ? "Success" : "No insights generated");
              } catch (insightError) {
                console.error("Error generating insights:", insightError);
                // Non-fatal error, continue with refresh
              }
            } else {
              console.log("Using existing insights");
            }
          } else {
            console.log("No upload ID found, insights cannot be associated with an upload");
          }
        } catch (insightsError) {
          console.error("Error in insights flow:", insightsError);
          // Continue even if insights generation fails
        }
      } else {
        console.log("Insufficient data for insights generation");
      }

      updateFeedbackProgress(90, 'Finalizando...');
      
      // Update the last refresh time
      setLastRefreshTime(new Date());

      // Complete the refresh
      setTimeout(() => {
        setInsightsProgress(100);
        setChartsProgress(100);
        setIsLoading(false);
        setIsChartsLoading(false);
        setIsRefreshing(false);
        showFeedback('success', 'Dados atualizados com sucesso', { duration: 2000 });
      }, 500);

      return {
        sgzCount: sgzData?.length || 0,
        painelCount: painelData?.length || 0
      };
    } catch (error) {
      console.error("Error refreshing chart data:", error);
      setIsRefreshing(false);
      setIsLoading(false);
      setIsChartsLoading(false);
      showFeedback('error', 'Erro ao atualizar dados: ' + (error.message || 'Erro desconhecido'), { duration: 3000 });
      throw error;
    }
  };

  /**
   * Generate insights using the edge function
   */
  const generateInsights = async (data: { 
    sgz_data: any[],
    painel_data: any[],
    upload_id: string
  }) => {
    try {
      console.log("Calling generate-ranking-insights API...");
      
      const response = await fetch('/api/generate-ranking-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from insights API:", errorData);
        throw new Error(`Error generating insights: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log("Insights API response received successfully");
      return result;
    } catch (error) {
      console.error('Error calling insights API:', error);
      throw error;
    }
  };

  return {
    refreshAllChartData,
    isRefreshing
  };
};
