
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PhotoUploadActions from './PhotoUploadActions';
import { usePhotoUpload } from './usePhotoUpload';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose }) => {
  const { uploadProfilePhoto, isUploading } = usePhotoUpload();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setUploadError(null);
  };

  const handleUpload = async (file: File) => {
    try {
      const url = await uploadProfilePhoto(file);
      if (url) {
        onClose();
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error uploading photo');
    }
  };

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
