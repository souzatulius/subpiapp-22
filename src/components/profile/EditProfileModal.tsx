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
import { Loader2, Info } from 'lucide-react';
import { 
  formatPhoneNumber, 
  formatDateInput, 
  parseFormattedDate, 
  formatDateToString 
} from '@/lib/inputFormatting';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { updateProfile, user } = useAuth();
  const { userProfile, fetchUserProfile, isLoading: profileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome_completo: '',
      whatsapp: '',
      aniversario: ''
    }
  });
  
  useEffect(() => {
    if (userProfile) {
      reset({
        nome_completo: userProfile.nome_completo || '',
        whatsapp: userProfile.whatsapp || '',
        aniversario: userProfile.aniversario 
          ? formatDateToString(new Date(userProfile.aniversario)) 
          : ''
      });
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

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Process date if it exists
      let aniversario: string | undefined = undefined;
      if (data.aniversario) {
        const parsedDate = parseFormattedDate(data.aniversario);
        if (parsedDate) {
          aniversario = parsedDate.toISOString();
        }
      }
      
      // When submitting the update, include the existing values for fields that shouldn't be updated
      const updateData = {
        nome_completo: data.nome_completo,
        whatsapp: data.whatsapp || null,
        aniversario: aniversario || null,
        cargo_id: userProfile?.cargo_id,
        coordenacao_id: userProfile?.coordenacao_id,
        supervisao_tecnica_id: userProfile?.supervisao_tecnica_id,
        foto_perfil_url: userProfile?.foto_perfil_url
      };
      
      // Use direct update instead of RPC function
      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      await fetchUserProfile();
      onClose();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "success",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setErrorMessage(error.message || "Ocorreu um erro ao atualizar seu perfil. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome Completo</Label>
              <Input
                id="nome_completo"
                {...register('nome_completo')}
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...register('whatsapp')}
                placeholder="(11) 98765-4321"
                onChange={handleWhatsAppChange}
              />
              {errors.whatsapp && (
                <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aniversario">Data de Aniversário</Label>
              <Input
                id="aniversario"
                {...register('aniversario')}
                placeholder="DD/MM/AAAA"
                onChange={handleDateChange}
              />
              {errors.aniversario && (
                <p className="text-sm text-red-500">{errors.aniversario.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={userProfile?.cargo || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordenacao">Coordenação</Label>
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
