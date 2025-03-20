
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DemandaDetalhes {
  id: string;
  titulo: string;
  status: string;
  area_coordenacao: {
    id: string;
    descricao: string;
  } | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
  respostas: Array<{
    texto: string;
    criado_em: string;
    autor: {
      nome_completo: string;
    }
  }>;
}

interface FormattedQA {
  question: string;
  answer: string;
}

export const useDemandaDetalhes = (demandaId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [demanda, setDemanda] = useState<DemandaDetalhes | null>(null);
  const [formattedResponses, setFormattedResponses] = useState<FormattedQA[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemandaDetalhes = async () => {
      if (!demandaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch demanda details
        const { data, error: demandaError } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            perguntas,
            area_coordenacao (
              id,
              descricao
            )
          `)
          .eq('id', demandaId)
          .single();
          
        if (demandaError) throw demandaError;
        
        // Fetch responses for this demanda
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select(`
            texto,
            criado_em,
            usuarios!inner (
              nome_completo
            )
          `)
          .eq('demanda_id', demandaId)
          .order('criado_em', { ascending: true });
          
        if (respostasError) throw respostasError;
        
        // Format responses
        const respostas = [];
        if (respostasData) {
          for (let i = 0; i < respostasData.length; i++) {
            const item = respostasData[i];
            respostas.push({
              texto: item.texto,
              criado_em: item.criado_em,
              autor: {
                nome_completo: item.usuarios?.nome_completo || 'Usuário'
              }
            });
          }
        }
        
        // Combine data
        const demandaWithRespostas: DemandaDetalhes = {
          ...data,
          respostas: respostas
        };
        
        setDemanda(demandaWithRespostas);
        
        // Format perguntas as QA pairs
        if (demandaWithRespostas.perguntas) {
          const formattedQA = formatarPerguntasRespostas(demandaWithRespostas.perguntas);
          setFormattedResponses(formattedQA);
        }
      } catch (err: any) {
        console.error('Error fetching demanda details:', err);
        setError(err.message || 'Erro ao carregar detalhes da demanda');
      } finally {
        setLoading(false);
      }
    };

    fetchDemandaDetalhes();
  }, [demandaId]);

  // Function to format perguntas object into QA pairs
  const formatarPerguntasRespostas = (perguntas: Record<string, string> | null): FormattedQA[] => {
    if (!perguntas) return [];
    
    const formatted: FormattedQA[] = [];
    const perguntasObj = perguntas as Record<string, string>;
    
    for (const key of Object.keys(perguntasObj)) {
      formatted.push({
        question: key,
        answer: perguntasObj[key]
      });
    }
    
    return formatted;
  };

  return { demanda, formattedResponses, loading, error };
};
