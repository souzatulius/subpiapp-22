
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface UserProfile {
  nome_completo: string;
  cargo?: string;
  area?: string;
  foto_perfil_url?: string;
  whatsapp?: string;
  aniversario?: string;
  cargo_id?: string;
  area_coordenacao_id?: string;
  cargos?: {
    descricao: string;
  };
  areas_coordenacao?: {
    descricao: string;
  };
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nome_completo: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      // Buscar perfil do usuário
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          nome_completo,
          cargo_id,
          area_coordenacao_id,
          foto_perfil_url,
          whatsapp,
          aniversario,
          cargos:cargo_id(descricao),
          areas_coordenacao:area_coordenacao_id(descricao)
        `)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserProfile({
        nome_completo: data.nome_completo,
        cargo: data.cargos?.descricao || '',
        area: data.areas_coordenacao?.descricao || '',
        foto_perfil_url: data.foto_perfil_url,
        whatsapp: data.whatsapp,
        aniversario: data.aniversario,
        cargo_id: data.cargo_id,
        area_coordenacao_id: data.area_coordenacao_id,
        cargos: data.cargos,
        areas_coordenacao: data.areas_coordenacao
      });
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar os dados do perfil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  return { userProfile, isLoading, fetchUserProfile };
};
