
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PhotoUploadActions from './PhotoUploadActions';
import { usePhotoUpload } from './usePhotoUpload';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose }) => {
  const { uploadProfilePhoto, isUploading } = usePhotoUpload();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    
    if (!file) {
      setPhotoPreview(null);
      setSelectedFile(null);
      return;
    }
    
    // Validação básica do arquivo antes de gerar preview
    if (!file.type.startsWith('image/')) {
      setUploadError('O arquivo deve ser uma imagem');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setUploadError('A imagem não pode exceder 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.onerror = () => {
      setUploadError('Erro ao ler o arquivo. Tente outro formato de imagem.');
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      setUploadError("Por favor selecione uma foto primeiro");
      return;
    }
    
    try {
      const url = await uploadProfilePhoto(selectedFile);
      if (url) {
        // Dispare eventos para atualizar a UI com a nova imagem
        window.dispatchEvent(new Event('profile:photo:updated'));
        window.dispatchEvent(new Event('storage'));
        onClose();
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao fazer upload da foto');
    }
  };
  
  // Reset state quando o modal é fechado
  const handleClose = () => {
    if (!isUploading) {
      setPhotoPreview(null);
      setSelectedFile(null);
      setUploadError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[80%] sm:w-full">
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
        </DialogHeader>
        
        <PhotoUploadActions 
          photoPreview={photoPreview}
          handlePhotoChange={handlePhotoChange}
          uploadError={uploadError}
          isUploading={isUploading}
        />

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePhotoModal;
