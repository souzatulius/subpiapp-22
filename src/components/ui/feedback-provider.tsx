
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import GlobalProgressBar from './global-progress-bar';

interface FeedbackProviderProps {
  children: React.ReactNode;
}

const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const { isLoading, isChartsLoading, insightsProgress, chartsProgress } = useRankingCharts();
  const { uploadProgress, isUploading, uploadStage } = useUploadState();

  // Show progress bar for uploads or chart loading
  useEffect(() => {
    if (isUploading) {
      setShowProgress(true);
      switch(uploadStage) {
        case 'uploading':
          setProgressText(`Enviando arquivos (${Math.round(uploadProgress)}%)`);
          break;
        case 'processing':
          setProgressText(`Processando dados (${Math.round(uploadProgress)}%)`);
          break;
        case 'complete':
          setProgressText('Upload completo!');
          setTimeout(() => setShowProgress(false), 1500);
          break;
        case 'error':
          setProgressText('Erro no upload');
          setTimeout(() => setShowProgress(false), 1500);
          break;
        default:
          setProgressText(`Carregando (${Math.round(uploadProgress)}%)`);
      }
    } else if (isChartsLoading || isLoading) {
      setShowProgress(true);
      const progress = Math.max(insightsProgress || 0, chartsProgress || 0);
      setProgressText(`Carregando dados (${Math.round(progress)}%)`);
    } else {
      // Hide progress bar when operations complete
      setTimeout(() => {
        setShowProgress(false);
      }, 1000);
    }
  }, [
    isUploading, 
    uploadProgress, 
    uploadStage,
    isChartsLoading, 
    isLoading,
    insightsProgress,
    chartsProgress
  ]);

  // Calculate combined progress percentage
  const calculateProgress = () => {
    if (isUploading) {
      return uploadProgress;
    } else if (isChartsLoading || isLoading) {
      return Math.max(insightsProgress || 0, chartsProgress || 0);
    }
    return 0;
  };

  return (
    <>
      <AnimatePresence>
        {showProgress && (
          <GlobalProgressBar 
            progress={calculateProgress()} 
            isVisible={showProgress}
            message={progressText}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default FeedbackProvider;
