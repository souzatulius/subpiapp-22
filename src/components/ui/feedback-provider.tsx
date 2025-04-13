
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
  const { isLoading } = useRankingCharts();
  
  // Monitor upload progress and show feedback
  useEffect(() => {
    if (sgzProgress?.stage === 'uploading' || sgzProgress?.stage === 'processing') {
      // Use either progress or calculate from totalRecords/processed
      const progress = sgzProgress.progress || 
        (sgzProgress.totalRecords && sgzProgress.processed 
          ? Math.round((sgzProgress.processed / sgzProgress.totalRecords) * 100) 
          : 10);
        
      const message = sgzProgress.stage === 'uploading' 
        ? 'Enviando arquivo SGZ...'
        : `Processando dados SGZ (${progress}%)`;
        
      showFeedback('loading', message, { 
        progress, 
        stage: sgzProgress.stage === 'uploading' ? 'Enviando' : 'Processando SGZ',
        duration: 0
      });
    } else if (painelProgress?.stage === 'uploading' || painelProgress?.stage === 'processing') {
      // Use either progress or calculate from totalRecords/processed
      const progress = painelProgress.progress || 
        (painelProgress.totalRecords && painelProgress.processed 
          ? Math.round((painelProgress.processed / painelProgress.totalRecords) * 100) 
          : 10);
        
      const message = painelProgress.stage === 'uploading' 
        ? 'Enviando arquivo do Painel...'
        : `Processando dados do Painel (${progress}%)`;
        
      showFeedback('loading', message, { 
        progress, 
        stage: painelProgress.stage === 'uploading' ? 'Enviando' : 'Processando Painel',
        duration: 0
      });
    } else if (isLoading && !isVisible) {
      showFeedback('loading', 'Processando dados...', { 
        progress: 50,
        stage: 'Carregando gráficos',
        duration: 0
      });
    }
  }, [
    sgzProgress, 
    painelProgress, 
    isLoading, 
    showFeedback,
    isVisible
  ]);
  
  // Update progress when new data comes in
  useEffect(() => {
    if (isVisible && isLoading) {
      updateFeedbackProgress(50, `Carregando visualizações (50%)`);
    }
  }, [isVisible, isLoading, updateFeedbackProgress]);
  
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
