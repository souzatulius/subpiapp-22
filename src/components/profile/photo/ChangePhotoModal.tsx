
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/components/layouts/header/useUserProfile';
import EditModal from '@/components/settings/EditModal';
import AvatarDisplay from './AvatarDisplay';
import PhotoUploadActions from './PhotoUploadActions';
import { usePhotoUpload } from './usePhotoUpload';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, fetchUserProfile, loading: profileLoading } = useUserProfile();
  
  const {
    loading,
    previewUrl,
    selectedFile,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    handleRemovePhoto,
    handleSavePhoto,
    photoRemoved
  } = usePhotoUpload(userProfile, fetchUserProfile, onClose);

  const footerContent = (
    <>
      <Button variant="outline" onClick={onClose} disabled={loading || profileLoading}>
        Cancelar
      </Button>
      {(selectedFile || photoRemoved) && (
        <Button 
          variant="default" 
          onClick={handleSavePhoto} 
          disabled={loading || profileLoading}
        >
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar'}
        </Button>
      )}
    </>
  );

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar Foto de Perfil"
      footerContent={footerContent}
    >
      {profileLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-subpi-blue" />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <AvatarDisplay userProfile={userProfile} previewUrl={previewUrl} />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <PhotoUploadActions 
            handleUploadClick={handleUploadClick}
            handleRemovePhoto={handleRemovePhoto}
            showRemoveButton={!!(userProfile?.foto_perfil_url || previewUrl)}
            loading={loading}
          />
          
          <div className="text-sm text-gray-500 text-center mt-2">
            <p>Tamanho máximo: 5MB</p>
            <p>Formatos aceitos: JPG, PNG, GIF</p>
          </div>
        </div>
      )}
    </EditModal>
  );
};

export default ChangePhotoModal;
