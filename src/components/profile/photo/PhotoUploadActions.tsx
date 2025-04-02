
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, X } from 'lucide-react';

interface PhotoUploadActionsProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  disabled: boolean;
}

const PhotoUploadActions: React.FC<PhotoUploadActionsProps> = ({
  selectedFile,
  onFileChange,
  disabled
}) => {
  // Create a hidden file input element that we can trigger programmatically
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    // Trigger the hidden file input click
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
    // Reset the input value so selecting the same file again will trigger the onChange
    e.target.value = '';
  };
  
  const handleRemovePhoto = () => {
    onFileChange(null);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleUploadClick}
        disabled={disabled}
        className="flex items-center"
      >
        <ImageIcon className="mr-2 h-4 w-4" />
        Escolher foto
      </Button>
      
      {selectedFile && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleRemovePhoto} 
          disabled={disabled}
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
