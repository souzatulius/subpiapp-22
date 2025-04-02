
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PhotoUploadActions from './PhotoUploadActions';
import { usePhotoUpload } from './usePhotoUpload';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose }) => {
  const { 
    photoPreview, 
    handlePhotoChange, 
    uploadError, 
    isUploading, 
    handleUpload 
  } = usePhotoUpload(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[80%] sm:w-full">
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
        </DialogHeader>
        
        <PhotoUploadActions 
          photoPreview={photoPreview}
          handlePhotoChange={handlePhotoChange}
          uploadError={uploadError}
          isUploading={isUploading}
          handleUpload={handleUpload}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePhotoModal;
