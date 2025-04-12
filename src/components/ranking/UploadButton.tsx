
import React from 'react';
import { Upload, Loader } from 'lucide-react';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

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
  const { sgzProgress, painelProgress } = useUploadState();
  
  // Check if we have any active uploads
  const isActiveUpload = sgzProgress?.stage === 'uploading' || 
                        sgzProgress?.stage === 'processing' ||
                        painelProgress?.stage === 'uploading' ||
                        painelProgress?.stage === 'processing';
  
  return (
    <>
      {isActiveUpload || isUploading ? (
        <Loader className="h-5 w-5 animate-spin text-orange-600" />
      ) : (
        <Upload className="h-5 w-5 text-gray-600" />
      )}
    </>
  );
};

export default UploadButton;
