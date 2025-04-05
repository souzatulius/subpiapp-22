
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NotaOficial } from '@/types/nota';

export const useNotasQuery = () => {
  return useQuery({
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
            atualizado_em,
            autor_id,
            autor:autor_id (id, nome_completo),
            aprovador_id,
            aprovador:aprovador_id (id, nome_completo),
            problema_id,
            problema:problema_id (
              id, 
              descricao,
              coordenacao:coordenacao_id (id, descricao)
            ),
            supervisao_tecnica_id,
            supervisao_tecnica:supervisao_tecnica_id (id, descricao, coordenacao_id),
            area_coordenacao:coordenacao_id (id, descricao),
            demanda_id,
            demanda:demanda_id (id, titulo),
            historico_edicoes:historico_edicoes_notas (
              id, 
              editor_id,
              criado_em,
              titulo_anterior,
              titulo_novo,
              texto_anterior,
              texto_novo,
              nota_id,
              editor:editor_id (id, nome_completo)
            )
          `)
          .order('criado_em', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to ensure consistent structure
        const transformedData: NotaOficial[] = (data || []).map(item => {
          // Handle autor safely
          const autor = item.autor ? {
            id: item.autor.id || '',
            nome_completo: item.autor.nome_completo || ''
          } : undefined;
          
          // Handle aprovador safely
          const aprovador = item.aprovador ? {
            id: item.aprovador.id || '',
            nome_completo: item.aprovador.nome_completo || ''
          } : null;
          
          // Handle problema safely
          const problema = item.problema ? {
            id: item.problema.id || '',
            descricao: item.problema.descricao || '',
            coordenacao: item.problema.coordenacao || null
          } : null;
          
          // Handle area_coordenacao safely
          let area_coordenacao = null;
          if (item.area_coordenacao) {
            area_coordenacao = {
              id: item.area_coordenacao.id || '',
              descricao: item.area_coordenacao.descricao || ''
            };
          } else if (item.problema?.coordenacao) {
            area_coordenacao = {
              id: item.problema.coordenacao.id || '',
              descricao: item.problema.coordenacao.descricao || ''
            };
          }
          
          // Handle supervisao_tecnica safely
          const supervisao_tecnica = item.supervisao_tecnica ? {
            id: item.supervisao_tecnica.id || '',
            descricao: item.supervisao_tecnica.descricao || '',
            coordenacao_id: item.supervisao_tecnica.coordenacao_id || ''
          } : null;
          
          // Handle demanda safely
          const demanda = item.demanda ? {
            id: item.demanda.id || '',
            titulo: item.demanda.titulo || ''
          } : null;
          
          return {
            id: item.id || '',
            titulo: item.titulo || '',
            conteudo: item.texto || '',
            texto: item.texto || '',
            status: item.status || '',
            criado_em: item.criado_em || '',
            created_at: item.criado_em || '',
            atualizado_em: item.atualizado_em || '',
            updated_at: item.atualizado_em || '',
            autor,
            aprovador,
            problema,
            supervisao_tecnica,
            area_coordenacao,
            demanda,
            demanda_id: item.demanda_id || null,
            problema_id: item.problema_id || null,
            historico_edicoes: item.historico_edicoes || []
          };
        });
        
        return transformedData;
      } catch (error) {
        console.error("Error fetching notas:", error);
        throw error;
      }
    }
  });
};
