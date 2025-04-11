
import React from 'react';
import { Upload, Loader } from 'lucide-react';
import FileUploadWithProgress from '@/components/shared/FileUploadWithProgress';
import { usePainelZeladoriaUpload } from '@/hooks/ranking/usePainelZeladoriaUpload';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';

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
  const { sgzProgress, painelProgress } = useUploadState();
  const { handleUploadPainel } = usePainelZeladoriaUpload(currentUser);
  
  const handleFileUpload = async (file: File) => {
    onUploadStart();
    try {
      const result = await handleUploadPainel(file);
      if (result && result.success) {
        showFeedback('success', `Upload concluído: ${result.recordCount} registros processados`, {
          duration: 3000
        });
        onPainelUploadComplete(result.id || "", result.data || []);
        onRefreshData();
      } else {
        showFeedback('error', result?.message || "Não foi possível processar o arquivo", {
          duration: 3000
        });
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      showFeedback('error', "Ocorreu um erro ao processar o arquivo", {
        duration: 3000
      });
    }
  };
  
  // Check if we have any active uploads
  const isActiveUpload = sgzProgress?.stage === 'uploading' || 
                        sgzProgress?.stage === 'processing' ||
                        painelProgress?.stage === 'uploading' ||
                        painelProgress?.stage === 'processing';
  
  return (
    <>
      {isActiveUpload ? (
        <Loader className="h-5 w-5 animate-spin text-orange-600" />
      ) : (
        <Upload className="h-5 w-5 text-gray-600" />
      )}
    </>
  );
};

export default UploadButton;
