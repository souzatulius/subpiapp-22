
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demanda } from '../types';
import { toast } from '@/components/ui/use-toast';
import { normalizeQuestions, processFileUrls } from '@/utils/questionFormatUtils';

export const useFetchDemandas = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState<boolean>(true);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoadingDemandas(true);
        
        // Check if resumo_situacao column exists
        const { error: testError } = await supabase
          .from('demandas')
          .select('resumo_situacao')
          .limit(1);
          
        const hasResumoSituacao = !testError;
        console.log('Has resumo_situacao column:', hasResumoSituacao);
        
        // Base query without resumo_situacao
        let baseQuery = `
          id,
          titulo,
          detalhes_solicitacao,
          prazo_resposta,
          prioridade,
          perguntas,
          status,
          horario_publicacao,
          endereco,
          nome_solicitante,
          email_solicitante,
          telefone_solicitante,
          veiculo_imprensa,
          arquivo_url,
          anexos,
          coordenacao_id,
          origem_id,
          tipo_midia_id,
          bairro_id,
          autor_id,
          problema_id,
          servico_id,
          protocolo,
          problemas:problema_id (
            id, 
            descricao,
            icone,
            coordenacao_id,
            coordenacao:coordenacao_id (
              id,
              descricao,
              sigla
            )
          ),
          coordenacoes:coordenacao_id (
            id,
            descricao,
            sigla
          ),
          origens_demandas:origem_id (id, descricao),
          tipos_midia:tipo_midia_id (id, descricao),
          bairros:bairro_id (
            id, 
            nome, 
            distrito_id,
            distritos:distrito_id (
              id,
              nome
            )
          ),
          autor:autor_id (id, nome_completo),
          servico:servico_id (id, descricao)
        `;
        
        // Add resumo_situacao if it exists
        const finalQuery = hasResumoSituacao ? `resumo_situacao, ${baseQuery}` : baseQuery;
        
        // Fetch data with appropriate columns
        const { data, error } = await supabase
          .from('demandas')
          .select(finalQuery)
          .in('status', ['pendente', 'em_andamento'])
          .order('horario_publicacao', { ascending: false });
        
        if (error) {
          console.error('Error fetching demandas:', error);
          toast({
            title: "Erro ao carregar demandas",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        // Fetch all respostas_demandas to filter out answered demands
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select('demanda_id');

        if (respostasError) {
          console.error('Error fetching respostas:', respostasError);
          toast({
            title: "Erro ao verificar respostas",
            description: respostasError.message,
            variant: "destructive"
          });
          return;
        }
        
        // Set of demand IDs that already have responses
        const respondedDemandIds = new Set(
          (respostasData || []).map(resposta => resposta?.demanda_id).filter(Boolean)
        );
        
        // Filter out demands that already have responses
        const filteredData = (data || []).filter(
          item => item && !respondedDemandIds.has(item.id as string)
        );
        
        // Transform the data to match the Demanda type
        const transformedData: Demanda[] = filteredData.map((item): Demanda => {
          if (!item) {
            // Return default empty Demanda if item is null or undefined
            return {
              id: '',
              titulo: '',
              prioridade: '',
              status: '',
              horario_publicacao: new Date().toISOString(),
            };
          }
          
          // Process perguntas to ensure it returns Record<string, string>
          let perguntasObject: Record<string, string> = {};
          
          if (item.perguntas) {
            try {
              if (Array.isArray(item.perguntas)) {
                // Convert array to object
                item.perguntas.forEach((question: string, index: number) => {
                  perguntasObject[index.toString()] = question || '';
                });
              } else if (typeof item.perguntas === 'object' && item.perguntas !== null) {
                // Convert object to Record<string, string>
                Object.entries(item.perguntas).forEach(([key, value]) => {
                  perguntasObject[key] = String(value || '');
                });
              }
            } catch (e) {
              console.error('Error processing perguntas:', e);
            }
          }
          
          // Process anexos to ensure it's a valid array of URLs
          const anexosArray = Array.isArray(item.anexos) ? item.anexos : [];
          const processedAnexos = anexosArray.length > 0 
            ? processFileUrls(anexosArray) 
            : [];
          
          // Process arquivo_url
          const arquivoUrl = item.arquivo_url 
            ? (processFileUrls([item.arquivo_url])[0] || null) 
            : null;
          
          // Extract distrito data if it exists
          const bairro = item.bairros || null;
          const distritoData = bairro && bairro.distritos ? bairro.distritos : null;
          
          // Create tema object if problema exists
          const tema = item.problemas ? {
            id: item.problemas.id || '',
            descricao: item.problemas.descricao || '',
            icone: item.problemas.icone || null,
            coordenacao: item.problemas.coordenacao || null
          } : null;
          
          return {
            id: item.id || '',
            titulo: item.titulo || '',
            detalhes_solicitacao: item.detalhes_solicitacao || null,
            resumo_situacao: hasResumoSituacao ? (item.resumo_situacao || null) : null,
            prazo_resposta: item.prazo_resposta || null,
            prioridade: item.prioridade || '',
            perguntas: perguntasObject,
            status: item.status || '',
            horario_publicacao: item.horario_publicacao || new Date().toISOString(),
            endereco: item.endereco || null,
            nome_solicitante: item.nome_solicitante || null,
            email_solicitante: item.email_solicitante || null,
            telefone_solicitante: item.telefone_solicitante || null,
            veiculo_imprensa: item.veiculo_imprensa || null,
            arquivo_url: arquivoUrl,
            anexos: processedAnexos,
            coordenacao_id: item.coordenacao_id || null,
            coordenacao: item.coordenacoes || null,
            supervisao_tecnica_id: null, // Add for backward compatibility
            bairro_id: item.bairro_id || null,
            autor_id: item.autor_id || null,
            tipo_midia_id: item.tipo_midia_id || null,
            origem_id: item.origem_id || null,
            problema_id: item.problema_id || null,
            servico_id: item.servico_id || null,
            protocolo: item.protocolo || null,
            tema,
            areas_coordenacao: null,
            origens_demandas: item.origens_demandas || null,
            tipos_midia: item.tipos_midia || null,
            bairros: item.bairros || null,
            distrito: distritoData,
            autor: item.autor || null,
            servico: item.servico || null,
            problema: item.problemas || null
          };
        });
        
        console.log('Transformed demandas for responding:', transformedData);
        setDemandas(transformedData);
      } catch (error: any) {
        console.error('Error in fetchDemandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Ocorreu um erro ao carregar as demandas.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingDemandas(false);
      }
    };
    
    fetchDemandas();
  }, []);

  return {
    demandas,
    setDemandas,
    isLoadingDemandas
  };
};
