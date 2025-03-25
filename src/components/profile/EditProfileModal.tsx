
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ProfileFormData {
  nome_completo: string;
  whatsapp: string;
  aniversario: string;
  cargo_id: string;
  coordenacao_id: string;
  supervisao_tecnica_id: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { updateProfile, user } = useAuth();
  const { userProfile, fetchUserProfile, isLoading: profileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const [supervisoes, setSupervisoes] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<any[]>([]);
  const [filteredSupervisoes, setFilteredSupervisoes] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProfileFormData>();
  
  const watchedCoordenacao = watch('coordenacao_id');

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Fetch cargos
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('*')
          .order('descricao');
        
        // Fetch coordenacoes
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');
        
        // Fetch all supervisions
        const { data: supervisoesData, error: supervisoesError } = await supabase
          .from('supervisoes_tecnicas')
          .select('*')
          .order('descricao');
        
        if (cargosError) throw cargosError;
        if (coordenacoesError) throw coordenacoesError;
        if (supervisoesError) throw supervisoesError;
        
        if (cargosData) setCargos(cargosData);
        if (coordenacoesData) setCoordenacoes(coordenacoesData);
        if (supervisoesData) setSupervisoes(supervisoesData);
        
        console.log('Coordenações loaded:', coordenacoesData?.length);
        console.log('All supervisions loaded:', supervisoesData?.length);
        
        // Get user's current coordenacao_id if available
        if (userProfile && userProfile.coordenacao_id) {
          setValue('coordenacao_id', userProfile.coordenacao_id);
          
          // Filter areas based on this coordenação
          const filtered = supervisoesData?.filter(supervisao => 
            supervisao.coordenacao_id === userProfile.coordenacao_id
          ) || [];
          
          console.log(`Filtered ${filtered.length} supervisions for coordination ${userProfile.coordenacao_id}`);
          setFilteredSupervisoes(filtered);
        } else {
          setFilteredSupervisoes([]);
        }
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
  }, [isOpen, userProfile, setValue]);

  // Filter supervisions when coordenação changes
  useEffect(() => {
    if (watchedCoordenacao && watchedCoordenacao !== 'select-coordenacao') {
      console.log(`Filtering supervisions for coordination ID: ${watchedCoordenacao}`);
      // Filter the cached supervisions directly to avoid extra API calls
      const filtered = supervisoes.filter(supervisao => supervisao.coordenacao_id === watchedCoordenacao);
      console.log(`Found ${filtered.length} supervisions for coordination ${watchedCoordenacao}`);
      setFilteredSupervisoes(filtered);
      
      // If the current supervisao_tecnica_id isn't in the filtered list, clear it
      const currentSupervisaoId = watch('supervisao_tecnica_id');
      if (currentSupervisaoId && !filtered.some(supervisao => supervisao.id === currentSupervisaoId)) {
        setValue('supervisao_tecnica_id', '');
      }
    } else {
      setFilteredSupervisoes([]);
    }
  }, [watchedCoordenacao, supervisoes, setValue, watch]);

  // Reset form when profile data changes
  useEffect(() => {
    if (userProfile) {
      reset({
        nome_completo: userProfile.nome_completo || '',
        whatsapp: userProfile.whatsapp || '',
        aniversario: userProfile.aniversario ? userProfile.aniversario.split('T')[0] : '',
        cargo_id: userProfile.cargo_id || '',
        coordenacao_id: userProfile.coordenacao_id || '',
        supervisao_tecnica_id: userProfile.supervisao_tecnica_id || '',
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
            <Select
              value={watch('cargo_id')}
              onValueChange={(value) => setValue('cargo_id', value)}
              disabled={loadingOptions}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-cargo">Selecione um cargo</SelectItem>
                {cargos.map(cargo => (
                  <SelectItem key={cargo.id} value={cargo.id}>
                    {cargo.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordenacao_id">Coordenação</Label>
            <Select
              value={watch('coordenacao_id')}
              onValueChange={(value) => {
                setValue('coordenacao_id', value);
                // Clear supervisao_tecnica_id when coordenação changes
                setValue('supervisao_tecnica_id', '');
              }}
              disabled={loadingOptions}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-coordenacao">Selecione uma coordenação</SelectItem>
                {coordenacoes.map(coord => (
                  <SelectItem key={coord.id} value={coord.id}>
                    {coord.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisao_tecnica_id">Supervisão Técnica</Label>
            <Select
              value={watch('supervisao_tecnica_id')}
              onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
              disabled={loadingOptions || !watchedCoordenacao || watchedCoordenacao === 'select-coordenacao' || filteredSupervisoes.length === 0}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder={
                  !watchedCoordenacao || watchedCoordenacao === 'select-coordenacao'
                    ? "Selecione uma coordenação primeiro" 
                    : filteredSupervisoes.length === 0 
                      ? "Nenhuma supervisão técnica para esta coordenação" 
                      : "Selecione uma supervisão técnica"
                } />
              </SelectTrigger>
              <SelectContent>
                {!watchedCoordenacao || watchedCoordenacao === 'select-coordenacao' ? (
                  <SelectItem value="no-coordenacao">
                    Selecione uma coordenação primeiro
                  </SelectItem>
                ) : filteredSupervisoes.length === 0 ? (
                  <SelectItem value="no-supervisions">
                    Nenhuma supervisão técnica para esta coordenação
                  </SelectItem>
                ) : (
                  <>
                    <SelectItem value="select-supervision">Selecione uma supervisão técnica</SelectItem>
                    {filteredSupervisoes.map(supervisao => (
                      <SelectItem key={supervisao.id} value={supervisao.id}>
                        {supervisao.descricao}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </form>
      )}
    </EditModal>
  );
};

export default EditProfileModal;
