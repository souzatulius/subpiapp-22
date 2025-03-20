
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
        
        // Use explicit type casting to avoid recursive type issues
        setDemanda(demandaData as unknown as Demanda);
        setRespostas(respostasData as Resposta[] || []);
        setNotaExistente(notaData as NotaExistente || null);
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

  // Fix the formatarPerguntasRespostas function to avoid recursive types
  const formatarPerguntasRespostas = (): PerguntaResposta[] => {
    if (!demanda?.perguntas) return [];
    
    const result: PerguntaResposta[] = [];
    
    // Safely convert perguntas to a Record type, avoiding deep recursion
    const perguntasObj: Record<string, string> = {};
    
    if (typeof demanda.perguntas === 'object' && demanda.perguntas !== null) {
      // Copy only the string values to avoid deep type recursion
      Object.entries(demanda.perguntas).forEach(([key, value]) => {
        if (typeof value === 'string') {
          perguntasObj[key] = value;
        }
      });
    }
    
    // Create PerguntaResposta objects from the perguntasObj
    for (const [key, pergunta] of Object.entries(perguntasObj)) {
      // Find a matching resposta in the respostas array
      const resposta = respostas.length > 0 ? respostas[0].texto || '' : '';
      
      result.push({ 
        pergunta, 
        resposta 
      });
    }
    
    return result;
  };

  const perguntasRespostas = demanda?.perguntas ? formatarPerguntasRespostas() : [];

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
