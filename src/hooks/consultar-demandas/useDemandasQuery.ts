
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';
import { useCurrentUser } from '@/components/settings/access-control/hooks/useCurrentUser';
import { useState, useEffect } from 'react';

export const useDemandasQuery = () => {
  const { currentUserId } = useCurrentUser();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Verificar se o usuário é administrador
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!currentUserId) return;
      
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: currentUserId });
        
      if (!error && data) {
        setIsAdmin(data);
      }
    };
    
    checkIfAdmin();
  }, [currentUserId]);

  return useQuery({
    queryKey: ['demandas', isAdmin],
    queryFn: async () => {
      console.log('Fetching all demandas, isAdmin:', isAdmin);
      
      // Buscar demandas com base no status admin
      let demandaQuery;
      
      if (isAdmin) {
        // Administradores podem ver todas as demandas, incluindo ocultas
        demandaQuery = supabase.from('demandas');
      } else {
        // Usuários normais só veem demandas não-ocultas
        demandaQuery = supabase.from('demandas_visiveis');
      }
      
      // Executar a consulta com as seleções de campos relevantes
      const { data: allDemandas, error: demandasError } = await demandaQuery
        .select(`
          *,
          area_coordenacao:area_coordenacao_id(descricao),
          servico:servico_id(descricao),
          origem:origem_id(descricao),
          tipo_midia:tipo_midia_id(descricao),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo)
        `)
        .order('horario_publicacao', { ascending: false });
      
      if (demandasError) {
        console.error('Error fetching demandas:', demandasError);
        throw demandasError;
      }
      
      // Parse perguntas JSON if it's a string
      const processedData = allDemandas?.map(item => {
        if (typeof item.perguntas === 'string') {
          try {
            item.perguntas = JSON.parse(item.perguntas);
          } catch (e) {
            item.perguntas = null;
          }
        }
        return item;
      }) || [];
      
      return processedData as Demand[];
    },
    meta: {
      onError: (err: any) => {
        console.error('Query error:', err);
        toast({
          title: "Erro ao carregar demandas",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });
};
