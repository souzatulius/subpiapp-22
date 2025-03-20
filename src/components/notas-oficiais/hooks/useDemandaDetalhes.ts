
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Demanda, NotaOficial, PerguntaResposta, Resposta } from '../types';
import { formatarPerguntasRespostas } from '../utils/formatarPerguntasRespostas';

export const useDemandaDetalhes = (demandaId: string) => {
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [notaExistente, setNotaExistente] = useState<NotaOficial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingNota, setCheckingNota] = useState(true);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [perguntasRespostas, setPerguntasRespostas] = useState<PerguntaResposta[]>([]);
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
            autor:autor_id (nome_completo)
          `)
          .eq('id', demandaId)
          .single();

        if (demandaError) throw demandaError;
        
        // Fetch respostas if any
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select('*')
          .eq('demanda_id', demandaId)
          .order('criado_em', { ascending: true });
          
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
        
        setDemanda(demandaData as Demanda);
        setNotaExistente(notaData as NotaOficial || null);
        setRespostas(respostasData as Resposta[] || []);
        
        // Process perguntas e respostas
        if (demandaData && demandaData.perguntas) {
          const pergResp = formatarPerguntasRespostas(demandaData, respostasData);
          setPerguntasRespostas(pergResp);
        }
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
        setCheckingNota(false);
      }
    };

    if (demandaId) {
      fetchDemandaDetalhes();
    }
  }, [demandaId, toast]);

  return {
    demanda,
    notaExistente,
    loading,
    isCheckingNota: checkingNota,
    error,
    respostas,
    perguntasRespostas
  };
};
