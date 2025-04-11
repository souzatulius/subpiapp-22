
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Demand } from './types';
import { normalizeQuestions, processFileUrls } from '@/utils/questionFormatUtils';

export const useDemandasQuery = () => {
  return useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Query all demandas without area/coordination filtering
      let query = supabase
        .from('demandas')
        .select(`
          id,
          titulo,
          status,
          prioridade,
          horario_publicacao,
          prazo_resposta,
          origem_id,
          origem:origem_id(id, descricao),
          problema_id,
          problema:problema_id(id, descricao,
            coordenacao:coordenacao_id (
              id, 
              descricao,
              sigla
            )
          ),
          tipo_midia_id,
          tipo_midia:tipo_midia_id(id, descricao),
          autor_id,
          autor:autor_id(id, nome_completo),
          detalhes_solicitacao,
          servico_id,
          servico:servico_id(id, descricao),
          area_coordenacao:problema_id (descricao),
          bairro_id,
          bairro:bairro_id(id, nome),
          perguntas,
          endereco,
          nome_solicitante,
          email_solicitante,
          telefone_solicitante,
          veiculo_imprensa,
          arquivo_url,
          anexos
        `);
      
      query = query.order('horario_publicacao', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get responses for all demands
      const { data: respostasData, error: respostasError } = await supabase
        .from('respostas_demandas')
        .select('*');
        
      if (respostasError) throw respostasError;
      
      // Get notas for all demands
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('id, demanda_id, titulo, autor_id');
        
      if (notasError) throw notasError;
      
      // Create a map of demand_id to notas
      const notasMap = (notasData || []).reduce((acc, nota) => {
        if (!acc[nota.demanda_id]) {
          acc[nota.demanda_id] = [];
        }
        acc[nota.demanda_id].push(nota);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Create a map of demand_id to response
      const respostasMap = (respostasData || []).reduce((acc, resposta) => {
        // Ensure respostas is a proper object
        let parsedRespostas: Record<string, string> | null = null;
        
        if (resposta.respostas) {
          if (typeof resposta.respostas === 'string') {
            try {
              parsedRespostas = JSON.parse(resposta.respostas);
            } catch (e) {
              console.error('Error parsing respostas:', e);
            }
          } else if (typeof resposta.respostas === 'object') {
            parsedRespostas = resposta.respostas as Record<string, string>;
          }
        }
        
        // Store formatted response in the map
        acc[resposta.demanda_id] = {
          ...resposta,
          respostas: parsedRespostas
        };
        
        return acc;
      }, {} as Record<string, any>);
      
      // Transform the data to match our Demand type
      const transformedData = (data || []).map(item => {
        // Handle perguntas formatting
        let perguntasObj: Record<string, string> | null = null;
        
        if (item.perguntas) {
          if (typeof item.perguntas === 'string') {
            try {
              perguntasObj = JSON.parse(item.perguntas);
            } catch (e) {
              console.error('Error parsing perguntas:', e);
            }
          } else if (typeof item.perguntas === 'object') {
            perguntasObj = item.perguntas as Record<string, string>;
          }
        }
        
        // Process anexos 
        const processedAnexos = processFileUrls(item.anexos);
        
        // Process arquivo_url
        const arquivo_url = item.arquivo_url ? 
          processFileUrls([item.arquivo_url])[0] || null : 
          null;
        
        console.log(`Processing demanda ${item.id}:`, {
          originalAnexos: item.anexos,
          processedAnexos,
          originalArquivoUrl: item.arquivo_url,
          processedArquivoUrl: arquivo_url
        });
        
        const result = {
          ...item,
          // Set default values for potentially missing fields
          servico: item.servico || { descricao: '' },
          area_coordenacao: item.area_coordenacao || { descricao: '' },
          perguntas: perguntasObj,
          anexos: processedAnexos,
          arquivo_url,
          // Add response data if available
          resposta: respostasMap[item.id] || null,
          // Add notas data if available
          notas: notasMap[item.id] || []
        };
        
        return result as unknown as Demand;
      });
      
      return transformedData;
    }
  });
};
