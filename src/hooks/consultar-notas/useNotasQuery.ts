
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
            conteudo: item.texto || '', // Map texto to conteudo for type compatibility
            texto: item.texto || '',
            status: item.status,
            criado_em: item.criado_em,
            
            // Handle potentially null or error objects with safe defaults
            autor: item.autor ? {
              id: typeof item.autor === 'object' && item.autor !== null && 'id' in item.autor 
                ? String(item.autor.id) 
                : '',
              nome_completo: typeof item.autor === 'object' && item.autor !== null && 'nome_completo' in item.autor 
                ? String(item.autor.nome_completo) 
                : ''
            } : { id: '', nome_completo: '' },
            
            aprovador: item.aprovador ? {
              id: typeof item.aprovador === 'object' && item.aprovador !== null && 'id' in item.aprovador 
                ? String(item.aprovador.id) 
                : '',
              nome_completo: typeof item.aprovador === 'object' && item.aprovador !== null && 'nome_completo' in item.aprovador 
                ? String(item.aprovador.nome_completo) 
                : ''
            } : null,
            
            problema: item.problema ? {
              id: typeof item.problema === 'object' && item.problema !== null && 'id' in item.problema 
                ? String(item.problema.id) 
                : '',
              descricao: typeof item.problema === 'object' && item.problema !== null && 'descricao' in item.problema 
                ? String(item.problema.descricao) 
                : '',
              coordenacao: typeof item.problema === 'object' && item.problema !== null && 'coordenacao' in item.problema
                ? item.problema.coordenacao
                : null
            } : null,
            
            supervisao_tecnica: item.supervisao_tecnica || null,
            
            area_coordenacao: (typeof item.problema === 'object' && 
                              item.problema !== null && 
                              'coordenacao' in item.problema && 
                              item.problema.coordenacao) ? {
              id: String(item.problema.coordenacao.id),
              descricao: String(item.problema.coordenacao.descricao)
            } : null,
            
            demanda: item.demanda || null,
            demanda_id: item.demanda_id || null,
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
