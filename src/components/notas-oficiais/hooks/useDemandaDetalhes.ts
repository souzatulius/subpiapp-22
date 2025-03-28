
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { normalizeQuestions } from '@/utils/questionFormatUtils';

export const useDemandaDetalhes = (demandaId: string) => {
  const [demanda, setDemanda] = useState<any | null>(null);
  const [respostas, setRespostas] = useState<any | null>(null);
  const [perguntas, setPerguntas] = useState<{ pergunta: string; resposta: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDemandaDetails = async () => {
      try {
        setIsLoading(true);
        if (!demandaId) return;

        // Buscar detalhes da demanda
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            problema_id,
            coordenacao_id,
            detalhes_solicitacao,
            perguntas,
            origem_id,
            origens_demandas:origem_id(id, descricao),
            tipo_midia_id,
            tipos_midia:tipo_midia_id(id, descricao),
            bairro_id,
            bairros:bairro_id(id, nome),
            problemas:problema_id(
              id, 
              descricao,
              coordenacao_id
            ),
            autor_id,
            autor:autor_id(id, nome_completo),
            horario_publicacao,
            prazo_resposta,
            prioridade,
            endereco,
            nome_solicitante,
            telefone_solicitante,
            email_solicitante,
            veiculo_imprensa,
            servico_id,
            servicos:servico_id(id, descricao)
          `)
          .eq('id', demandaId)
          .single();

        if (error) {
          throw error;
        }

        // Buscar respostas da demanda
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select('*')
          .eq('demanda_id', demandaId)
          .maybeSingle();

        if (respostasError) {
          throw respostasError;
        }

        // Buscar o problema relacionado
        let problema = null;
        if (data.problema_id) {
          const { data: problemaData, error: problemaError } = await supabase
            .from('problemas')
            .select('id, descricao, coordenacao_id')
            .eq('id', data.problema_id)
            .single();

          if (!problemaError) {
            problema = problemaData;
          }
        }

        // Formatar o resultado final
        const result = {
          id: data.id,
          titulo: data.titulo,
          status: data.status,
          area_coordenacao: {
            descricao: problema?.descricao || 'Não informada'
          },
          detalhes_solicitacao: data.detalhes_solicitacao,
          perguntas: data.perguntas,
          origem: data.origens_demandas,
          tipo_midia: data.tipos_midia,
          bairro: data.bairros,
          autor: data.autor,
          horario_publicacao: data.horario_publicacao,
          prazo_resposta: data.prazo_resposta,
          prioridade: data.prioridade,
          endereco: data.endereco,
          nome_solicitante: data.nome_solicitante,
          telefone_solicitante: data.telefone_solicitante,
          email_solicitante: data.email_solicitante,
          veiculo_imprensa: data.veiculo_imprensa,
          servico: data.servicos,
          coordenacao_id: data.coordenacao_id || problema?.coordenacao_id,
          problema_id: data.problema_id
        };

        setDemanda(result);
        setRespostas(respostasData);

        // Processar perguntas e respostas
        if (data.perguntas && respostasData?.respostas) {
          const perguntasNormalizadas = normalizeQuestions(data.perguntas);
          const respostasObj = typeof respostasData.respostas === 'string' 
            ? JSON.parse(respostasData.respostas) 
            : respostasData.respostas;

          const perguntasRespostas = perguntasNormalizadas.map((pergunta, index) => {
            return {
              pergunta,
              resposta: respostasObj[index.toString()] || ''
            };
          });

          setPerguntas(perguntasRespostas);
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes da demanda:', error);
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar os detalhes da demanda.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandaDetails();
  }, [demandaId]);

  return {
    demanda,
    respostas,
    perguntas,
    isLoading
  };
};
