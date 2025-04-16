
import React, { useEffect } from 'react';
import AnimatedFeedback from './animated-feedback';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { useLocation } from 'react-router-dom';

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
  
  // Safely use location - wrap in try/catch to handle cases where Router is not available
  let isRankingSubsPage = false;
  try {
    const location = useLocation();
    isRankingSubsPage = location.pathname === '/dashboard/zeladoria/ranking-subs';
  } catch (error) {
    // Router not available, location cannot be used
    console.log('Router not available, location cannot be determined');
    isRankingSubsPage = false;
  }
  
  // Monitor upload progress and show feedback
  useEffect(() => {
    if (!isRankingSubsPage) return; // Only show automatic progress on ranking-subs page
    
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
    } else if (isRankingSubsPage && isLoading && !isVisible) {
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
    isVisible,
    isRankingSubsPage
  ]);
  
  // Update progress when new data comes in
  useEffect(() => {
    if (isVisible && isLoading && isRankingSubsPage) {
      updateFeedbackProgress(50, `Carregando visualizações (50%)`);
    }
  }, [isVisible, isLoading, updateFeedbackProgress, isRankingSubsPage]);
  
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
