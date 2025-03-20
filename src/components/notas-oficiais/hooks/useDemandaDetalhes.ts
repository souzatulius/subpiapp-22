
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Demanda, NotaExistente, Resposta, PerguntaResposta } from '../types';

export const useDemandaDetalhes = (demandaId: string) => {
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [notaExistente, setNotaExistente] = useState<NotaExistente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingNota, setIsCheckingNota] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDemandaDetalhes = async () => {
      setLoading(true);
      try {
        // Fetch demanda data
        const { data: demandaData, error: demandaError } = await supabase
          .from('demandas')
          .select(`
            *,
            areas_coordenacao (id, descricao),
            autor: usuario_id (nome_completo)
          `)
          .eq('id', demandaId)
          .single();

        if (demandaError) throw demandaError;
        
        // Fetch respostas
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select(`
            *,
            usuario:usuario_id (nome_completo)
          `)
          .eq('demanda_id', demandaId)
          .order('criado_em', { ascending: false });

        if (respostasError) throw respostasError;
        
        // Check if nota already exists for this demanda
        const { data: notaData, error: notaError } = await supabase
          .from('notas_oficiais')
          .select('*')
          .eq('demanda_id', demandaId)
          .maybeSingle();
          
        if (notaError) {
          console.error('Erro ao buscar nota oficial:', notaError);
        }
        
        // First convert to 'unknown' as suggested by TypeScript error
        // Break the type reference chain with explicit casting
        const processedDemanda = {
          id: demandaData.id,
          titulo: demandaData.titulo,
          status: demandaData.status,
          horario_publicacao: demandaData.horario_publicacao,
          prazo_resposta: demandaData.prazo_resposta,
          detalhes_solicitacao: demandaData.detalhes_solicitacao,
          protocolo: demandaData.protocolo,
          prioridade: demandaData.prioridade,
          arquivo_url: demandaData.arquivo_url,
          perguntas: demandaData.perguntas,
          areas_coordenacao: demandaData.areas_coordenacao,
          autor: {
            nome_completo: demandaData.autor?.nome_completo || 'Não especificado'
          }
        } as Demanda;
        
        const processedRespostas = (respostasData || []).map(resposta => ({
          id: resposta.id,
          texto: resposta.texto,
          arquivo_url: resposta.arquivo_url,
          criado_em: resposta.criado_em,
          usuario: resposta.usuario 
            ? { nome_completo: resposta.usuario.nome_completo } 
            : null
        })) as Resposta[];
        
        const processedNota = notaData ? {
          id: notaData.id,
          titulo: notaData.titulo,
          texto: notaData.texto,
          status: notaData.status,
          demanda_id: demandaId // Explicitly add demanda_id that's missing
        } as NotaExistente : null;

        setDemanda(processedDemanda);
        setRespostas(processedRespostas);
        setNotaExistente(processedNota);
      } catch (error: any) {
        console.error('Erro ao buscar detalhes da demanda:', error);
        setError(error.message || "Não foi possível carregar os detalhes da demanda.");
        toast({
          title: "Erro ao carregar detalhes",
          description: error.message || "Não foi possível carregar os detalhes da demanda.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsCheckingNota(false);
      }
    };

    if (demandaId) {
      fetchDemandaDetalhes();
    }
  }, [demandaId, toast]);

  // Completely rewritten function to avoid recursive type issues
  const formatarPerguntasRespostas = (): PerguntaResposta[] => {
    if (!demanda || !demanda.perguntas) return [];
    
    const result: PerguntaResposta[] = [];
    
    try {
      // Safely handle the perguntas object to avoid circular references
      const perguntasEntries: [string, string][] = [];
      
      if (typeof demanda.perguntas === 'object' && demanda.perguntas !== null) {
        // Extract only key-value string pairs
        Object.entries(demanda.perguntas as Record<string, unknown>).forEach(([key, value]) => {
          if (typeof value === 'string') {
            perguntasEntries.push([key, value]);
          }
        });
      }
      
      // Create the pergunta-resposta pairs
      for (const [_, pergunta] of perguntasEntries) {
        // Get simple resposta text
        const resposta = respostas.length > 0 ? respostas[0].texto || '' : '';
        
        result.push({
          pergunta,
          resposta
        });
      }
    } catch (err) {
      console.error('Error in formatarPerguntasRespostas:', err);
      // Return empty array on error to prevent UI from breaking
      return [];
    }
    
    return result;
  };

  const perguntasRespostas = formatarPerguntasRespostas();

  return {
    demanda,
    respostas,
    perguntasRespostas,
    notaExistente,
    loading,
    isCheckingNota,
    error
  };
};
