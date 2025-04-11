
import React, { useEffect } from 'react';
import AnimatedFeedback from './animated-feedback';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isVisible, 
    feedbackType, 
    feedbackMessage, 
    options,
    hideFeedback, 
    showFeedback, 
    updateFeedbackProgress
  } = useAnimatedFeedback();
  
  const { sgzProgress, painelProgress } = useUploadState();
  const { isInsightsLoading, isChartsLoading, insightsProgress, chartsProgress } = useRankingCharts();
  
  // Monitor upload progress and show feedback
  useEffect(() => {
    if (sgzProgress?.stage === 'uploading' || sgzProgress?.stage === 'processing') {
      const progress = sgzProgress.processedRows && sgzProgress.totalRows 
        ? Math.floor((sgzProgress.processedRows / sgzProgress.totalRows) * 100) 
        : 10;
        
      const message = sgzProgress.stage === 'uploading' 
        ? 'Enviando arquivo SGZ...'
        : `Processando dados SGZ (${progress}%)`;
        
      showFeedback('loading', message, { 
        progress, 
        stage: sgzProgress.stage === 'uploading' ? 'Enviando' : 'Processando SGZ',
        duration: 0
      });
    } else if (painelProgress?.stage === 'uploading' || painelProgress?.stage === 'processing') {
      const progress = painelProgress.processedRows && painelProgress.totalRows 
        ? Math.floor((painelProgress.processedRows / painelProgress.totalRows) * 100) 
        : 10;
        
      const message = painelProgress.stage === 'uploading' 
        ? 'Enviando arquivo do Painel...'
        : `Processando dados do Painel (${progress}%)`;
        
      showFeedback('loading', message, { 
        progress, 
        stage: painelProgress.stage === 'uploading' ? 'Enviando' : 'Processando Painel',
        duration: 0
      });
    } else if (isInsightsLoading && !isVisible) {
      showFeedback('loading', 'Gerando análise inteligente...', { 
        progress: insightsProgress,
        stage: 'Processando dados',
        duration: 0
      });
    } else if (isChartsLoading && !isInsightsLoading && !isVisible) {
      showFeedback('loading', 'Gerando visualizações...', { 
        progress: chartsProgress,
        stage: 'Criando gráficos',
        duration: 0
      });
    }
  }, [
    sgzProgress, 
    painelProgress, 
    isInsightsLoading, 
    isChartsLoading, 
    insightsProgress, 
    chartsProgress,
    showFeedback,
    isVisible
  ]);
  
  // Update progress when insights or charts progress changes
  useEffect(() => {
    if (isVisible && isInsightsLoading) {
      updateFeedbackProgress(insightsProgress, `Analisando dados (${insightsProgress}%)`);
    } else if (isVisible && isChartsLoading) {
      updateFeedbackProgress(chartsProgress, `Gerando gráficos (${chartsProgress}%)`);
    }
  }, [isVisible, isInsightsLoading, isChartsLoading, insightsProgress, chartsProgress, updateFeedbackProgress]);
  
  return (
    <>
      {children}
      <AnimatedFeedback
        visible={isVisible}
        type={feedbackType}
        message={feedbackMessage}
        onClose={hideFeedback}
        options={options}
      />
    </>
  );
};

export default FeedbackProvider;
