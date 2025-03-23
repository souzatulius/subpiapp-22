
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Loader2 } from 'lucide-react';

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
    <div className="flex space-x-3">
      <Button
        onClick={handleUploadClick}
        variant="outline"
        size="sm"
        disabled={loading}
      >
        <Upload className="h-4 w-4 mr-2" />
        Selecionar Imagem
      </Button>
      
      {showRemoveButton && (
        <Button
          onClick={handleRemovePhoto}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover Foto
        </Button>
      )}
    </div>
  );
};

export default PhotoUploadActions;
