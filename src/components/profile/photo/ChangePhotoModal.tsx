
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { usePhotoUpload } from './usePhotoUpload';
import AvatarDisplay from './AvatarDisplay';
import PhotoUploadActions from './PhotoUploadActions';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { uploadProfilePhoto, isUploading } = usePhotoUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    try {
      const newPhotoUrl = await uploadProfilePhoto(selectedFile);
      if (newPhotoUrl) {
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };
  
  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
          <DialogDescription>
            Escolha uma nova foto para o seu perfil
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center gap-6 py-4">
          <div className="relative">
            <AvatarDisplay 
              imageSrc={previewUrl || user?.user_metadata?.avatar_url || ''}
              nome={user?.user_metadata?.name || 'Usuário'}
              size="xl"
            />
          </div>
          
          <PhotoUploadActions
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            disabled={isUploading}
          />
          
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
            </p>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePhotoModal;
