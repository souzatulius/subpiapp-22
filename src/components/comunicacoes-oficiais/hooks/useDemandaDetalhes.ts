
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Demand, ComunicacaoOficial } from '../types';

export const useDemandaDetalhes = (demandaId: string) => {
  const [demanda, setDemanda] = useState<Demand | null>(null);
  const [comunicacaoExistente, setComunicacaoExistente] = useState<ComunicacaoOficial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingComunicacao, setCheckingComunicacao] = useState(true);
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
        
        // Check if comunicacao already exists for this demanda
        const { data: comunicacaoData, error: comunicacaoError } = await supabase
          .from('comunicacoes_oficiais')
          .select('*')
          .eq('demanda_id', demandaId)
          .maybeSingle();
          
        if (comunicacaoError) {
          console.error('Erro ao buscar comunicação oficial:', comunicacaoError);
        }
        
        setDemanda(demandaData);
        setComunicacaoExistente(comunicacaoData || null);
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
        setCheckingComunicacao(false);
      }
    };

    if (demandaId) {
      fetchDemandaDetalhes();
    }
  }, [demandaId, toast]);

  return {
    demanda,
    comunicacaoExistente,
    loading,
    error,
    checkingComunicacao
  };
};
