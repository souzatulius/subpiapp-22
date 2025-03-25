
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
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nome_completo: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
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
            cargos:cargo_id(descricao)
          `)
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Buscar área de coordenação separadamente
        let areaDescricao = '';
        if (data.area_coordenacao_id) {
          const { data: areaData, error: areaError } = await supabase
            .from('areas_coordenacao')
            .select('descricao')
            .eq('id', data.area_coordenacao_id)
            .single();
          
          if (!areaError && areaData) {
            areaDescricao = areaData.descricao;
          }
        }
        
        setUserProfile({
          nome_completo: data.nome_completo,
          cargo: data.cargos?.descricao || '',
          area: areaDescricao,
          foto_perfil_url: data.foto_perfil_url,
          whatsapp: data.whatsapp,
          aniversario: data.aniversario,
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

    fetchUserProfile();
  }, [user]);

  return { userProfile, isLoading };
};
