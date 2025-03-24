
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '../types';

// The bucket name must only contain lowercase letters, numbers, dots, and hyphens
const PROFILE_PHOTOS_BUCKET = 'profile-photos';

export const usePhotoUpload = (
  userProfile: UserProfile | null, 
  fetchUserProfile: () => Promise<void>,
  onClose: () => void
) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setPhotoRemoved(false);
  }, []);

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
    setPhotoRemoved(false);
    
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
          try {
            await supabase.storage.from(PROFILE_PHOTOS_BUCKET).remove([filename]);
          } catch (error) {
            console.warn('Erro ao remover arquivo de storage, continuando com a atualização do perfil:', error);
            // Continue with profile update even if file removal fails
          }
        }
      }

      // Mark photo as removed, but don't update the profile yet
      setPreviewUrl(null);
      setSelectedFile(null);
      setPhotoRemoved(true);
      
      toast({
        title: "Foto removida",
        description: "Clique em Salvar para confirmar a remoção da foto.",
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
    if (!user) return;
    
    setLoading(true);
    try {
      let publicUrl = null;
      
      // If there's a selected file, upload it
      if (selectedFile) {
        // Generate a unique filename
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the file - assume bucket already exists
        const { error: uploadError, data } = await supabase.storage
          .from(PROFILE_PHOTOS_BUCKET)
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          if (uploadError.message.includes('bucket') || uploadError.message.includes('Bucket')) {
            // If there's a bucket-related error, inform the user
            throw new Error(`A pasta de armazenamento "${PROFILE_PHOTOS_BUCKET}" não existe. Entre em contato com o administrador do sistema.`);
          } else {
            throw uploadError;
          }
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from(PROFILE_PHOTOS_BUCKET).getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // Update user profile with new photo URL or null if removed
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: photoRemoved ? null : publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;

      await fetchUserProfile();
      onClose();
      
      toast({
        title: photoRemoved ? "Foto removida" : "Foto atualizada",
        description: photoRemoved 
          ? "Sua foto de perfil foi removida com sucesso." 
          : "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao salvar foto:', error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao salvar sua foto de perfil: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    previewUrl,
    selectedFile,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    handleRemovePhoto,
    handleSavePhoto,
    photoRemoved
  };
};
