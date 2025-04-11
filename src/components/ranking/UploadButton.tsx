
import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
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
  
  // Handle click with better feedback
  const handleClick = async () => {
    if (isUploading) {
      showFeedback('warning', 'Há um upload em andamento, aguarde a conclusão');
      return;
    }
    
    // If not uploading, trigger data refresh with visual feedback
    try {
      setIsRefreshing(true);
      await onRefreshData();
      showFeedback('success', 'Dados atualizados com sucesso');
    } catch (error) {
      showFeedback('error', 'Erro ao atualizar os dados');
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      {isRefreshing ? (
        <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
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
