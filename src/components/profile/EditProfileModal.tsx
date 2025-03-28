
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/components/layouts/header/useUserProfile';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EditModal from '@/components/settings/EditModal';
import { Loader2, Info, Camera } from 'lucide-react';
import { 
  formatPhoneNumber, 
  formatDateInput, 
  parseFormattedDate, 
  formatDateToString 
} from '@/lib/inputFormatting';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { v4 as uuidv4 } from 'uuid';

const profileSchema = z.object({
  nome_completo: z.string().min(1, "Nome é obrigatório"),
  whatsapp: z.string().optional(),
  aniversario: z.string()
    .refine(val => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
      message: "Data deve estar no formato DD/MM/AAAA"
    })
    .refine(val => {
      if (!val) return true;
      const date = parseFormattedDate(val);
      return !!date;
    }, {
      message: "Data inválida"
    })
    .optional(),
  foto_perfil_url: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { userProfile, fetchUserProfile, isLoading: profileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome_completo: '',
      whatsapp: '',
      aniversario: '',
      foto_perfil_url: ''
    }
  });
  
  useEffect(() => {
    if (userProfile) {
      reset({
        nome_completo: userProfile.nome_completo || '',
        whatsapp: userProfile.whatsapp || '',
        aniversario: userProfile.aniversario 
          ? formatDateToString(new Date(userProfile.aniversario)) 
          : '',
        foto_perfil_url: userProfile.foto_perfil_url || ''
      });
      setPhotoPreview(userProfile.foto_perfil_url || null);
    }
  }, [userProfile, reset]);

  // Format WhatsApp as user types
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setValue('whatsapp', formattedValue);
  };

  // Format date as user types
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatDateInput(value);
    setValue('aniversario', formattedValue);
  };

  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("A imagem não pode exceder 5MB");
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

  // Ensure profile-photos bucket exists
  const ensureProfilePhotosBucketExists = async () => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'profile-photos');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('profile-photos', {
          public: true
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring profile photos bucket exists:', error);
      return false;
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    
    try {
      let photoUrl = userProfile?.foto_perfil_url || null;
      
      // Upload new photo if selected
      if (photoFile) {
        const bucketExists = await ensureProfilePhotosBucketExists();
        if (!bucketExists) {
          throw new Error("Não foi possível configurar o armazenamento para fotos");
        }
        
        // Generate unique file name
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${user.id}-${uuidv4()}.${fileExt}`;
        
        // Upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, photoFile, {
            upsert: true,
            cacheControl: '3600'
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          photoUrl = urlData.publicUrl;
        }
      }
      
      // Process date if it exists
      let aniversario: string | null = null;
      if (data.aniversario && data.aniversario.trim() !== '') {
        const parsedDate = parseFormattedDate(data.aniversario);
        if (parsedDate) {
          aniversario = parsedDate.toISOString();
        }
      }
      
      // Update directly in the usuarios table
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_completo: data.nome_completo,
          whatsapp: data.whatsapp || null,
          aniversario: aniversario,
          foto_perfil_url: photoUrl,
          // Preserve existing values
          cargo_id: userProfile?.cargo_id,
          coordenacao_id: userProfile?.coordenacao_id,
          supervisao_tecnica_id: userProfile?.supervisao_tecnica_id,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await fetchUserProfile();
      onClose();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setErrorMessage(error.message || "Ocorreu um erro ao atualizar seu perfil. Tente novamente.");
    } finally {
      setSubmitting(false);
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

  const isLoading = profileLoading || submitting;

  const footerContent = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancelar
      </Button>
      <Button type="submit" form="profileForm" disabled={isLoading}>
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar'}
      </Button>
    </>
  );

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
      footerContent={footerContent}
    >
      {profileLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-subpi-blue" />
        </div>
      ) : (
        <form id="profileForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
              {errorMessage}
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Você pode editar suas informações pessoais neste formulário. Para alterações em cargo e área, entre em contato com a administração.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Preview" />
                ) : userProfile?.foto_perfil_url ? (
                  <AvatarImage src={userProfile.foto_perfil_url} alt={userProfile.nome_completo} />
                ) : (
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {getInitials(userProfile?.nome_completo)}
                  </AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="photo-upload" 
                className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome_completo" className="font-semibold">Nome Completo</Label>
              <Input
                id="nome_completo"
                {...register('nome_completo')}
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="font-semibold">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 98765-4321"
                value={watch('whatsapp') || ''}
                onChange={handleWhatsAppChange}
              />
              {errors.whatsapp && (
                <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aniversario" className="font-semibold">Data de Aniversário</Label>
              <Input
                id="aniversario"
                placeholder="DD/MM/AAAA"
                value={watch('aniversario') || ''}
                onChange={handleDateChange}
              />
              {errors.aniversario && (
                <p className="text-sm text-red-500">{errors.aniversario.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="font-semibold">Cargo</Label>
              <Input
                id="cargo"
                value={userProfile?.cargo || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordenacao" className="font-semibold">Coordenação</Label>
              <Input
                id="coordenacao"
                value={userProfile?.coordenacao || ''}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
        </form>
      )}
    </EditModal>
  );
};

export default EditProfileModal;
