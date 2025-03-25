
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
  area_coordenacao_id: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { updateProfile, user } = useAuth();
  const { userProfile, fetchUserProfile, isLoading: profileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<any[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<any[]>([]);
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
        
        // Fetch coordenações (is_supervision = false)
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao')
          .eq('is_supervision', false)
          .order('descricao');
        
        // Fetch all supervisions
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('*')
          .eq('is_supervision', true)
          .order('descricao');
        
        if (cargosError) throw cargosError;
        if (coordenacoesError) throw coordenacoesError;
        if (areasError) throw areasError;
        
        if (cargosData) setCargos(cargosData);
        if (coordenacoesData) setCoordenacoes(coordenacoesData);
        if (areasData) setAreas(areasData);
        
        console.log('Coordenações loaded:', coordenacoesData?.length);
        console.log('Supervisions loaded:', areasData?.length);
        
        // Get user's current coordenacao_id if available
        if (userProfile && userProfile.coordenacao_id) {
          setValue('coordenacao_id', userProfile.coordenacao_id);
          
          // Filter areas based on this coordenação
          const { data: filteredAreasData, error: filteredAreasError } = await supabase
            .from('areas_coordenacao')
            .select('*')
            .eq('is_supervision', true)
            .eq('coordenacao_id', userProfile.coordenacao_id);
            
          if (filteredAreasError) throw filteredAreasError;
          
          setFilteredAreas(filteredAreasData || []);
        } else {
          setFilteredAreas([]);
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
  }, [isOpen, userProfile]);

  // Filter areas when coordenação changes
  useEffect(() => {
    const filterAreas = async () => {
      if (watchedCoordenacao) {
        try {
          setLoadingOptions(true);
          
          // Fetch supervisions for the selected coordination
          const { data: filteredAreasData, error: filteredAreasError } = await supabase
            .from('areas_coordenacao')
            .select('*')
            .eq('is_supervision', true)
            .eq('coordenacao_id', watchedCoordenacao);
          
          if (filteredAreasError) throw filteredAreasError;
          
          console.log(`Found ${filteredAreasData?.length} supervisions for coordination ${watchedCoordenacao}`);
          setFilteredAreas(filteredAreasData || []);
          
          // If the current area_coordenacao_id isn't in the filtered list, clear it
          const currentAreaId = watch('area_coordenacao_id');
          if (currentAreaId && !filteredAreasData?.some(area => area.id === currentAreaId)) {
            setValue('area_coordenacao_id', '');
          }
        } catch (error) {
          console.error('Error filtering areas:', error);
        } finally {
          setLoadingOptions(false);
        }
      } else {
        setFilteredAreas([]);
      }
    };
    
    filterAreas();
  }, [watchedCoordenacao, setValue, watch]);

  // Reset form when profile data changes
  useEffect(() => {
    if (userProfile) {
      reset({
        nome_completo: userProfile.nome_completo || '',
        whatsapp: userProfile.whatsapp || '',
        aniversario: userProfile.aniversario ? userProfile.aniversario.split('T')[0] : '',
        cargo_id: userProfile.cargo_id || '',
        coordenacao_id: userProfile.coordenacao_id || '',
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
                // Clear area_coordenacao_id when coordenação changes
                setValue('area_coordenacao_id', '');
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
            <Label htmlFor="area_coordenacao_id">Supervisão Técnica</Label>
            <Select
              value={watch('area_coordenacao_id')}
              onValueChange={(value) => setValue('area_coordenacao_id', value)}
              disabled={loadingOptions || !watchedCoordenacao || filteredAreas.length === 0}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder={
                  !watchedCoordenacao 
                    ? "Selecione uma coordenação primeiro" 
                    : filteredAreas.length === 0 
                      ? "Nenhuma supervisão técnica para esta coordenação" 
                      : "Selecione uma supervisão técnica"
                } />
              </SelectTrigger>
              <SelectContent>
                {!watchedCoordenacao ? (
                  <SelectItem value="no-coordenacao">
                    Selecione uma coordenação primeiro
                  </SelectItem>
                ) : filteredAreas.length === 0 ? (
                  <SelectItem value="no-supervisions">
                    Nenhuma supervisão técnica para esta coordenação
                  </SelectItem>
                ) : (
                  <>
                    <SelectItem value="select-supervision">Selecione uma supervisão técnica</SelectItem>
                    {filteredAreas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.descricao}
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
