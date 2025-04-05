
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NotaOficial } from '@/types/nota';

export interface UseNotasQueryResult {
  data: NotaOficial[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

export const useNotasQuery = (): UseNotasQueryResult => {
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notas-oficiais'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            id,
            titulo,
            texto,
            status,
            criado_em,
            autor_id,
            autor:autor_id (id, nome_completo),
            aprovador_id,
            aprovador:aprovador_id (id, nome_completo),
            problema_id,
            problema:problema_id (
              id, 
              descricao,
              coordenacao_id,
              coordenacao:coordenacao_id (id, descricao)
            ),
            supervisao_tecnica_id,
            supervisao_tecnica:supervisao_tecnica_id (id, descricao),
            coordenacao_id,
            demanda_id,
            demanda:demanda_id (id, titulo)
          `)
          .order('criado_em', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data with safe fallbacks
        const transformedData: NotaOficial[] = (data || []).map(item => {
          // Create a default type-safe object
          const nota: NotaOficial = {
            id: item.id,
            titulo: item.titulo,
            conteudo: item.texto, // Map texto to conteudo for type compatibility
            texto: item.texto,
            status: item.status,
            criado_em: item.criado_em,
            
            // Handle potentially null or error objects with safe defaults
            autor: item.autor || { id: '', nome_completo: '' },
            aprovador: item.aprovador || null,
            
            problema: item.problema ? {
              id: item.problema.id,
              descricao: item.problema.descricao,
              coordenacao: item.problema.coordenacao || null
            } : null,
            
            supervisao_tecnica: item.supervisao_tecnica || null,
            
            area_coordenacao: (item.problema?.coordenacao) ? {
              id: item.problema.coordenacao.id,
              descricao: item.problema.coordenacao.descricao
            } : null,
            
            demanda: item.demanda || null,
            demanda_id: item.demanda_id || null,
            coordenacao_id: item.coordenacao_id || null,
            problema_id: item.problema_id || null
          };
          
          return nota;
        });
        
        return transformedData;
      } catch (error) {
        console.error("Error fetching notas:", error);
        throw error;
      }
    }
  });
  
  return {
    data,
    isLoading,
    error,
    refetch
  };
};
