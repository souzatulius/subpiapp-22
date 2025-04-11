
import React, { useState } from 'react';
import { Upload, Loader2, RefreshCw } from 'lucide-react';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { Button } from '@/components/ui/button';

interface UploadButtonProps {
  isUploading: boolean;
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  currentUser: any;
  onRefreshData: () => Promise<void>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  isUploading,
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  currentUser,
  onRefreshData
}) => {
  const { showFeedback } = useAnimatedFeedback();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle click with better feedback
  const handleClick = async () => {
    if (isUploading) {
      showFeedback('error', 'Há um upload em andamento, aguarde a conclusão');
      return;
    }
    
    // Show processing state with animation
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Start the progress animation
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        const newValue = prev + 1;
        return newValue > 95 ? 95 : newValue;
      });
    }, 200);
    
    // If not uploading, trigger data refresh with visual feedback
    try {
      setIsRefreshing(true);
      await onRefreshData();
      clearInterval(progressInterval);
      setProcessingProgress(100);
      showFeedback('success', 'Dados atualizados com sucesso');
    } catch (error) {
      clearInterval(progressInterval);
      setProcessingProgress(0);
      showFeedback('error', 'Erro ao atualizar os dados');
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  return (
    <div className="relative">
      {isProcessing ? (
        <div className="flex items-center">
          <div className="relative w-5 h-5">
            <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
            <div 
              className="absolute top-0 left-0 w-full h-full rounded-full" 
              style={{
                background: `conic-gradient(rgb(234, 88, 12) ${processingProgress}%, transparent ${processingProgress}%)`,
                opacity: 0.3
              }}
            />
          </div>
        </div>
      ) : isRefreshing ? (
        <RefreshCw className="h-5 w-5 text-gray-600 animate-spin" />
      ) : (
        <Upload 
          className="h-5 w-5 text-gray-600 hover:text-orange-600 transition-colors cursor-pointer" 
          onClick={handleClick}
        />
      )}
    </div>
  );
};

export default UploadButton;
