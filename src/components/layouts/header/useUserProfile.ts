
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
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          nome_completo,
          cargo_id,
          area_coordenacao_id,
          foto_perfil_url,
          whatsapp,
          aniversario
        `)
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Buscar cargo e área separadamente para evitar erros de relação
      let cargoInfo = { descricao: '' };
      if (userData.cargo_id) {
        const { data: cargoData, error: cargoError } = await supabase
          .from('cargos')
          .select('descricao')
          .eq('id', userData.cargo_id)
          .single();
          
        if (!cargoError && cargoData) {
          cargoInfo = { descricao: cargoData.descricao };
        }
      }
      
      let areaInfo = { descricao: '' };
      if (userData.area_coordenacao_id) {
        const { data: areaData, error: areaError } = await supabase
          .from('areas_coordenacao')
          .select('descricao')
          .eq('id', userData.area_coordenacao_id)
          .single();
          
        if (!areaError && areaData) {
          areaInfo = { descricao: areaData.descricao };
        }
      }
      
      setUserProfile({
        nome_completo: userData.nome_completo,
        cargo: cargoInfo.descricao,
        area: areaInfo.descricao,
        foto_perfil_url: userData.foto_perfil_url,
        whatsapp: userData.whatsapp,
        aniversario: userData.aniversario,
        cargo_id: userData.cargo_id,
        area_coordenacao_id: userData.area_coordenacao_id,
        cargos: cargoInfo,
        areas_coordenacao: areaInfo
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
