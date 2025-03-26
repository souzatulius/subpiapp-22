
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

export const useServicosData = () => {
  const [servicos, setServicos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        setIsLoading(true);
        
        // Verificar se o usuário é admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: user?.id });
        
        let query = supabase.from('servicos').select(`
          id, 
          descricao, 
          supervisao_tecnica_id,
          supervisoes_tecnicas:supervisao_tecnica_id (
            id,
            descricao,
            coordenacao_id,
            coordenacoes:coordenacao_id (
              id,
              descricao
            )
          )
        `);
        
        // Se não for admin, filtrar por coordenação do usuário
        if (!isAdmin && user) {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('coordenacao_id')
            .eq('id', user.id)
            .single();
            
          if (userError) throw userError;
          if (userData?.coordenacao_id) {
            query = query.eq('supervisoes_tecnicas.coordenacao_id', userData.coordenacao_id);
          }
        }
        
        const { data, error } = await query.order('descricao');
        if (error) throw error;
        
        setServicos(data || []);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        toast({
          title: "Erro ao carregar serviços",
          description: "Não foi possível carregar a lista de serviços.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchServicos();
    }
  }, [user]);

  return {
    servicos,
    isLoading
  };
};
