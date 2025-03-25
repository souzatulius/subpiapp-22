
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

interface ProfileFormData {
  nome_completo: string;
  whatsapp: string;
  aniversario: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { updateProfile, user } = useAuth();
  const { userProfile, fetchUserProfile, isLoading: profileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();
  
  useEffect(() => {
    if (userProfile) {
      reset({
        nome_completo: userProfile.nome_completo || '',
        whatsapp: userProfile.whatsapp || '',
        aniversario: userProfile.aniversario 
          ? (typeof userProfile.aniversario === 'string' 
             ? userProfile.aniversario.split('T')[0] 
             : new Date(userProfile.aniversario).toISOString().split('T')[0]) 
          : '',
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      // When submitting the update, include the existing values for fields that shouldn't be updated
      const updateData = {
        ...data,
        cargo_id: userProfile?.cargo_id,
        coordenacao_id: userProfile?.coordenacao_id,
        supervisao_tecnica_id: userProfile?.supervisao_tecnica_id,
      };
      
      await updateProfile(updateData);
      await fetchUserProfile();
      onClose();
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
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
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Você pode editar suas informações pessoais neste formulário. Para alterações em cargo, coordenação e supervisão técnica, entre em contato com a administração.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input
              id="nome_completo"
              {...register('nome_completo', { required: 'Nome é obrigatório' })}
            />
            {errors.nome_completo && (
              <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              {...register('whatsapp')}
              placeholder="(11) 98765-4321"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aniversario">Data de Aniversário</Label>
            <Input
              id="aniversario"
              type="date"
              {...register('aniversario')}
            />
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
            <p className="text-xs text-gray-500">O email não pode ser alterado.</p>
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

          <div className="space-y-2">
            <Label htmlFor="supervisao">Supervisão Técnica</Label>
            <Input
              id="supervisao"
              value={userProfile?.supervisao_tecnica || ''}
              disabled
              className="bg-gray-100"
            />
          </div>
        </form>
      )}
    </EditModal>
  );
};

export default EditProfileModal;
