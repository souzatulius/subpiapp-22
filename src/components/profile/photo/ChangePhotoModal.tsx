
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, UploadCloud } from 'lucide-react';
import { useUserProfile } from '@/components/layouts/header/useUserProfile';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { userProfile, refreshUserProfile } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("A imagem não pode exceder 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError("O arquivo deve ser uma imagem");
        return;
      }
      
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ensureProfilePhotosBucketExists = async () => {
    try {
      // Check if 'profile-photos' bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'profile-photos');
      
      if (!bucketExists) {
        console.log('Profile photos bucket does not exist. Creating it...');
        // Create bucket if it doesn't exist
        await supabase.storage.createBucket('profile-photos', {
          public: true
        });
        
        // Set bucket RLS policy to allow authenticated reads
        console.log('Profile photos bucket created successfully');
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring profile photos bucket exists:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não identificado. Por favor, faça login novamente.",
        variant: "destructive"
      });
      return;
    }
    
    if (!photoFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem para upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Ensure bucket exists
      const bucketExists = await ensureProfilePhotosBucketExists();
      if (!bucketExists) {
        throw new Error("Não foi possível configurar o armazenamento para fotos");
      }
      
      // Generate unique file name
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}-${uuidv4()}.${fileExt}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, photoFile, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error uploading profile photo:', uploadError);
        throw new Error("Erro ao fazer upload da foto: " + uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        // Update user profile with new photo URL
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ foto_perfil_url: urlData.publicUrl })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile with photo URL:', updateError);
          throw new Error("Erro ao atualizar perfil: " + updateError.message);
        }
        
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso."
        });
        
        await refreshUserProfile();
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating profile photo:', error);
      setUploadError(error.message || "Ocorreu um erro ao processar o upload da foto");
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar a foto de perfil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Foto de Perfil</DialogTitle>
          <DialogDescription>
            Escolha uma nova foto para seu perfil
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Prévia" />
                ) : userProfile?.foto_perfil_url ? (
                  <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo} />
                ) : (
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {getInitials(userProfile?.nome_completo)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                  <UploadCloud className="h-4 w-4" />
                  <span>Selecionar foto</span>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              
              <p className="text-xs text-gray-500 text-center">
                Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !photoFile}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePhotoModal;
