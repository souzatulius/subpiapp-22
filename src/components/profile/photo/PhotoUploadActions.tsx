
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, X } from 'lucide-react';

interface PhotoUploadActionsProps {
  photoPreview: string | null;
  handlePhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadError: string | null;
  isUploading: boolean;
  handleUpload: (file: File) => Promise<void>;
}

const PhotoUploadActions: React.FC<PhotoUploadActionsProps> = ({
  photoPreview,
  handlePhotoChange,
  uploadError,
  isUploading,
  handleUpload
}) => {
  // Create a hidden file input element that we can trigger programmatically
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    // Trigger the hidden file input click
    fileInputRef.current?.click();
  };
  
  const handleFileSelected = () => {
    const files = fileInputRef.current?.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };
  
  return (
    <div className="space-y-4">
      {photoPreview && (
        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={photoPreview} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="text-sm text-red-500 mb-2">
          {uploadError}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          {isUploading ? 'Enviando...' : 'Escolher foto'}
        </Button>
        
        {photoPreview && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadActions;
