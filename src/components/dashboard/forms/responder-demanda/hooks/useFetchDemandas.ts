
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demanda } from '../types';
import { toast } from '@/components/ui/use-toast';

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
            supervisao_tecnica_id,
            origem_id,
            tipo_midia_id,
            bairro_id,
            autor_id,
            problema_id,
            protocolo,
            area_coordenacao_id:supervisao_tecnica_id (id, descricao),
            origens_demandas:origem_id (id, descricao),
            tipos_midia:tipo_midia_id (id, descricao),
            bairros:bairro_id (id, nome)
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
          let perguntasArray: string[] | null = null;
          if (item.perguntas) {
            // If it's an array already, use it
            if (Array.isArray(item.perguntas)) {
              perguntasArray = item.perguntas as string[];
            }
            // If it's a string, try to parse it or convert to array with one element
            else if (typeof item.perguntas === 'string') {
              try {
                const parsed = JSON.parse(item.perguntas);
                perguntasArray = Array.isArray(parsed) ? parsed : [item.perguntas];
              } catch {
                perguntasArray = [item.perguntas];
              }
            }
            // For other cases, convert to empty array
            else {
              console.warn('Unexpected perguntas format:', item.perguntas);
              perguntasArray = [];
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
            supervisao_tecnica_id: item.supervisao_tecnica_id,
            bairro_id: item.bairro_id,
            autor_id: item.autor_id,
            tipo_midia_id: item.tipos_midia?.id,
            origem_id: item.origens_demandas?.id,
            problema_id: item.problema_id,
            servico_id: null, // Note: Add servico_id property but set to null
            protocolo: item.protocolo,
            areas_coordenacao: item.area_coordenacao_id,
            origens_demandas: item.origens_demandas,
            tipos_midia: item.tipos_midia,
            bairros: item.bairros
          };
        });
        
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
