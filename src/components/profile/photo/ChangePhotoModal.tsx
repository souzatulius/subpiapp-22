
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
  const { userProfile, refreshUserProfile, isLoading: profileLoading } = useUserProfile();
  
  const handleClose = async () => {
    // Atualizar perfil do usuário ao fechar para garantir que as alterações sejam exibidas
    await refreshUserProfile();
    onClose();
  };
  
  const {
    loading,
    previewUrl,
    selectedFile,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    handleRemovePhoto,
    handleSavePhoto,
    photoRemoved,
    error
  } = usePhotoUpload(userProfile, refreshUserProfile, handleClose);

  const footerContent = (
    <>
      <Button variant="outline" onClick={handleClose} disabled={loading || profileLoading}>
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
      onClose={handleClose}
      title="Alterar Foto de Perfil"
      footerContent={footerContent}
    >
      {profileLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-subpi-blue" />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <AvatarDisplay 
            nome={userProfile?.nome_completo} 
            imageSrc={previewUrl || userProfile?.foto_perfil_url} 
            size="xl" 
          />
          
          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}
          
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
