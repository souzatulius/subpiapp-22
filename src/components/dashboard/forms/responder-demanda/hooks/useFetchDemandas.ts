
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demanda } from '../types';
import { toast } from '@/components/ui/use-toast';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

export const useFetchDemandas = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState<boolean>(true);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoadingDemandas(true);
        
        // First get demands
        const { data, error } = await supabase
          .from('demandas')
          .select(`
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
              coordenacao_id
            ),
            origens_demandas:origem_id (id, descricao),
            tipos_midia:tipo_midia_id (id, descricao),
            bairros:bairro_id (
              id, 
              nome, 
              distrito_id
            ),
            distrito:bairros(distrito_id(id, nome)),
            autor:autor_id (id, nome_completo),
            servico:servico_id (id, descricao)
          `)
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

        console.log('Demandas raw data:', data);

        // Now fetch all respostas_demandas to filter out answered demands
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

        // Create a set of demand IDs that already have responses
        const respondedDemandIds = new Set(respostasData.map(resposta => resposta.demanda_id));
        
        // Filter out demands that already have responses
        const filteredData = data.filter(demanda => !respondedDemandIds.has(demanda.id));
        
        // Transform the data to match the Demanda type
        const transformedData: Demanda[] = (filteredData || []).map(item => {
          // Handle perguntas type conversion: ensure it's string[] or null
          let perguntasArray = normalizeQuestions(item.perguntas);
          
          // Process anexos to ensure it's always an array
          let anexosArray: string[] | null = null;
          if (item.anexos) {
            if (Array.isArray(item.anexos)) {
              anexosArray = item.anexos.filter(a => a && typeof a === 'string');
            } else if (typeof item.anexos === 'string') {
              try {
                const parsed = JSON.parse(item.anexos);
                anexosArray = Array.isArray(parsed) ? parsed : [item.anexos];
              } catch {
                anexosArray = [item.anexos];
              }
            }
          }
          
          return {
            id: item.id,
            titulo: item.titulo,
            detalhes_solicitacao: item.detalhes_solicitacao,
            prazo_resposta: item.prazo_resposta,
            prioridade: item.prioridade,
            perguntas: perguntasArray,
            status: item.status,
            horario_publicacao: item.horario_publicacao,
            endereco: item.endereco,
            nome_solicitante: item.nome_solicitante,
            email_solicitante: item.email_solicitante,
            telefone_solicitante: item.telefone_solicitante,
            veiculo_imprensa: item.veiculo_imprensa,
            arquivo_url: item.arquivo_url,
            anexos: anexosArray,
            coordenacao_id: item.coordenacao_id,
            supervisao_tecnica_id: null, // Add this field with null value for backward compatibility
            bairro_id: item.bairro_id,
            autor_id: item.autor_id,
            tipo_midia_id: item.tipos_midia?.id,
            origem_id: item.origens_demandas?.id,
            problema_id: item.problema_id,
            servico_id: item.servico_id,
            protocolo: item.protocolo,
            areas_coordenacao: null, // Atualizando para usar o relacionamento problema-coordenacao
            origens_demandas: item.origens_demandas,
            tipos_midia: item.tipos_midia,
            bairros: item.bairros,
            distrito: item.distrito?.[0] || null,  // Access first item from district array
            autor: item.autor,
            servico: item.servico
          };
        });
        
        console.log('Transformed demandas:', transformedData);
        setDemandas(transformedData);
      } catch (error) {
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
