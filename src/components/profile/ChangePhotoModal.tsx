
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUserProfile } from '@/components/layouts/header/useUserProfile';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import EditModal from '@/components/settings/EditModal';
import { Camera, Upload, Trash2, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { userProfile, fetchUserProfile, loading: profileLoading } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo da imagem é 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // If the user has an existing photo, remove it from storage
      if (userProfile?.foto_perfil_url) {
        const urlParts = userProfile.foto_perfil_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        if (filename) {
          await supabase.storage.from('profile_photos').remove([filename]);
        }
      }

      // Update user profile
      await supabase
        .from('usuarios')
        .update({ foto_perfil_url: null })
        .eq('id', user.id);

      await fetchUserProfile();
      setPreviewUrl(null);
      setSelectedFile(null);
      
      toast({
        title: "Foto removida",
        description: "Sua foto de perfil foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover sua foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!user || !selectedFile) return;
    
    setLoading(true);
    try {
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('profile_photos').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Update user profile with new photo URL
      await supabase
        .from('usuarios')
        .update({ foto_perfil_url: publicUrl })
        .eq('id', user.id);

      await fetchUserProfile();
      onClose();
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar sua foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const footerContent = (
    <>
      <Button variant="outline" onClick={onClose} disabled={loading || profileLoading}>
        Cancelar
      </Button>
      {selectedFile && (
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
          <Avatar className="h-32 w-32 border-4 border-gray-200">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Preview" />
            ) : userProfile?.foto_perfil_url ? (
              <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo} />
            ) : (
              <AvatarFallback className="text-3xl bg-subpi-blue text-white">
                {userProfile?.nome_completo ? getUserInitials(userProfile.nome_completo) : 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
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
            
            {(userProfile?.foto_perfil_url || previewUrl) && (
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
