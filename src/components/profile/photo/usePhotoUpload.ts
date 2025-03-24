
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '../types';

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

  // Reset state when modal opens
  useEffect(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
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
            await supabase.storage.from('profile_photos').remove([filename]);
          } catch (error) {
            console.warn('Erro ao remover arquivo de storage, continuando com a atualização do perfil:', error);
            // Continue with profile update even if file removal fails
          }
        }
      }

      // Update user profile
      const { error } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: null })
        .eq('id', user.id);
        
      if (error) throw error;

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

      // Upload the file - assume bucket already exists
      const { error: uploadError, data } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('bucket') || uploadError.message.includes('Bucket')) {
          // If there's a bucket-related error, inform the user
          throw new Error('A pasta de armazenamento de fotos não existe. Entre em contato com o administrador do sistema.');
        } else {
          throw uploadError;
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from('profile_photos').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Update user profile with new photo URL
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;

      await fetchUserProfile();
      onClose();
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
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
    handleSavePhoto
  };
};
