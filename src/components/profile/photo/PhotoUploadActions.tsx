
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, X } from 'lucide-react';

interface PhotoUploadActionsProps {
  handleUploadClick: () => void;
  handleRemovePhoto: () => void;
  showRemoveButton: boolean;
  loading: boolean;
}

const PhotoUploadActions: React.FC<PhotoUploadActionsProps> = ({
  handleUploadClick,
  handleRemovePhoto,
  showRemoveButton,
  loading
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleUploadClick}
        disabled={loading}
        className="flex items-center"
      >
        <ImageIcon className="mr-2 h-4 w-4" />
        Escolher foto
      </Button>
      
      {showRemoveButton && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleRemovePhoto} 
          disabled={loading}
          className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
        >
          <X className="mr-2 h-4 w-4" />
          Remover
        </Button>
      )}
    </div>
  );
};

export default PhotoUploadActions;
