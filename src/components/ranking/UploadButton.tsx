
import React from 'react';
import { Upload } from 'lucide-react';
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
  const { showFeedback } = useAnimatedFeedback();

  return (
    <Upload 
      className="h-5 w-5 text-gray-600" 
      onClick={() => {
        if (isUploading) {
          showFeedback('warning', 'Há um upload em andamento, aguarde a conclusão');
        }
      }}
    />
  );
};

export default UploadButton;
