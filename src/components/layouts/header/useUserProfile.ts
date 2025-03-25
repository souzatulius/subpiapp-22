
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { UserProfile } from '@/types/common';

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
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          nome_completo,
          cargo_id,
          supervisao_tecnica_id,
          coordenacao_id,
          foto_perfil_url,
          whatsapp,
          aniversario,
          email
        `)
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Fetch position and area separately to avoid relation errors
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
      
      let supervisaoTecnicaInfo = { 
        descricao: '',
        coordenacao_id: ''
      };
      
      if (userData.supervisao_tecnica_id) {
        const { data: supervisaoData, error: supervisaoError } = await supabase
          .from('supervisoes_tecnicas')
          .select('descricao, coordenacao_id')
          .eq('id', userData.supervisao_tecnica_id)
          .single();
          
        if (!supervisaoError && supervisaoData) {
          supervisaoTecnicaInfo = { 
            descricao: supervisaoData.descricao,
            coordenacao_id: supervisaoData.coordenacao_id || ''
          };
        }
      }
      
      // Fetch coordination
      let coordenacaoInfo = { descricao: '' };
      if (userData.coordenacao_id) {
        const { data: coordenacaoData, error: coordenacaoError } = await supabase
          .from('coordenacoes')
          .select('descricao')
          .eq('id', userData.coordenacao_id)
          .single();
          
        if (!coordenacaoError && coordenacaoData) {
          coordenacaoInfo = { descricao: coordenacaoData.descricao };
        }
      }
      
      setUserProfile({
        id: user.id,
        nome_completo: userData.nome_completo,
        cargo: cargoInfo.descricao,
        supervisao_tecnica: supervisaoTecnicaInfo.descricao,
        coordenacao: coordenacaoInfo.descricao,
        foto_perfil_url: userData.foto_perfil_url,
        avatar_url: userData.foto_perfil_url, // Adicionando avatar_url como alias
        whatsapp: userData.whatsapp,
        aniversario: userData.aniversario,
        email: userData.email,
        cargo_id: userData.cargo_id,
        supervisao_tecnica_id: userData.supervisao_tecnica_id,
        coordenacao_id: userData.coordenacao_id,
        cargos: cargoInfo,
        supervisao_tecnica_info: supervisaoTecnicaInfo
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
