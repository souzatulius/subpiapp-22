
import { useState, useRef, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types/common';

// Standardized bucket name and folder structure
const PROFILE_PHOTOS_BUCKET = 'usuarios';
const PROFILE_PHOTOS_FOLDER = 'fotos_perfil';

export const usePhotoUpload = (
  userProfile: UserProfile | null, 
  refreshUserProfile: () => Promise<void>,
  onClose: () => void
) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione uma imagem");
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("O tamanho máximo da imagem é 5MB");
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo da imagem é 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPhotoRemoved(false);
    setError(null);
    
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
    setPreviewUrl(null);
    setSelectedFile(null);
    setPhotoRemoved(true);
    setError(null);
  };

  const handleSavePhoto = async () => {
    if (!user) {
      setError("Você precisa estar logado para fazer essa ação");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // If photo was removed
      if (photoRemoved) {
        // If the user has an existing photo, remove it from storage
        if (userProfile?.foto_perfil_url) {
          try {
            const urlPath = new URL(userProfile.foto_perfil_url).pathname;
            const filePath = urlPath.split('/').slice(2).join('/'); // Remove /storage/v1/object/
            
            if (filePath) {
              await supabase.storage.from(PROFILE_PHOTOS_BUCKET).remove([filePath]);
            }
          } catch (err) {
            console.error('Error parsing or removing old photo:', err);
            // Continue even if old photo removal fails
          }
        }
        
        // Update user profile with null photo URL
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ foto_perfil_url: null })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        await refreshUserProfile();
        onClose();
        
        toast({
          title: "Foto removida",
          description: "Sua foto de perfil foi removida com sucesso.",
        });
        
        return;
      }
      
      // If there's a new photo to upload
      if (selectedFile) {
        // Generate standardized filename with extension
        const fileExt = selectedFile.name.split('.').pop() || 'jpg';
        const filePath = `${PROFILE_PHOTOS_FOLDER}/${user.id}/${Date.now()}.${fileExt}`;
        
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from(PROFILE_PHOTOS_BUCKET)
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from(PROFILE_PHOTOS_BUCKET)
          .getPublicUrl(filePath);
        
        if (!urlData.publicUrl) {
          throw new Error("Não foi possível obter URL da imagem");
        }
        
        // Update user profile with new photo URL
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ foto_perfil_url: urlData.publicUrl })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        await refreshUserProfile();
        onClose();
        
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      } else if (!photoRemoved) {
        // If neither a new photo nor removal, just close the modal
        onClose();
      }
    } catch (error: any) {
      console.error('Erro ao salvar foto:', error);
      setError(error.message || "Ocorreu um erro ao salvar a foto de perfil");
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a foto de perfil.",
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
    photoRemoved,
    error,
    handleFileChange,
    handleUploadClick,
    handleRemovePhoto,
    handleSavePhoto
  };
};
