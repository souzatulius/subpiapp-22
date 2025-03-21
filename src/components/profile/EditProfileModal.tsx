
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
import { Loader2 } from 'lucide-react';

interface ProfileFormData {
  nome_completo: string;
  whatsapp: string;
  aniversario: string;
  cargo_id: string;
  area_coordenacao_id: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { updateProfile, user } = useAuth();
  const { userProfile, fetchUserProfile, loading: profileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();

  // Fetch areas and cargos on mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const { data: areasData, error: areasError } = await supabase.from('areas_coordenacao').select('*').order('descricao');
        const { data: cargosData, error: cargosError } = await supabase.from('cargos').select('*').order('descricao');
        
        if (areasError) throw areasError;
        if (cargosError) throw cargosError;
        
        if (areasData) setAreas(areasData);
        if (cargosData) setCargos(cargosData);
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as opções de áreas e cargos.",
          variant: "destructive",
        });
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  // Reset form when profile data changes
  useEffect(() => {
    if (userProfile) {
      reset({
        nome_completo: userProfile.nome_completo || '',
        whatsapp: userProfile.whatsapp || '',
        aniversario: userProfile.aniversario ? userProfile.aniversario.split('T')[0] : '',
        cargo_id: userProfile.cargo_id || '',
        area_coordenacao_id: userProfile.area_coordenacao_id || '',
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      await updateProfile(data);
      await fetchUserProfile();
      onClose();
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
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

  const isLoading = profileLoading || loadingOptions || submitting;

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
            <Label htmlFor="cargo_id">Cargo</Label>
            <select
              id="cargo_id"
              {...register('cargo_id')}
              className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-700 shadow-sm transition-all duration-300"
              disabled={loadingOptions}
            >
              <option value="">Selecione um cargo</option>
              {cargos.map(cargo => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.descricao}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_coordenacao_id">Área de Coordenação</Label>
            <select
              id="area_coordenacao_id"
              {...register('area_coordenacao_id')}
              className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-700 shadow-sm transition-all duration-300"
              disabled={loadingOptions}
            >
              <option value="">Selecione uma área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.descricao}
                </option>
              ))}
            </select>
          </div>
        </form>
      )}
    </EditModal>
  );
};

export default EditProfileModal;
