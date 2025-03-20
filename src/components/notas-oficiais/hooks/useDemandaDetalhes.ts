
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Demanda, NotaOficial } from '../types';

interface UseDemandaDetalhesReturn {
  demanda: Demanda | null;
  loading: boolean;
  error: string | null;
  notaExistente: NotaOficial | null;
  checkingNota: boolean;
}

export const useDemandaDetalhes = (demandaId: string): UseDemandaDetalhesReturn => {
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notaExistente, setNotaExistente] = useState<NotaOficial | null>(null);
  const [checkingNota, setCheckingNota] = useState(true);
  const { toast } = useToast();
  
  const fetchDemandaDetalhes = useCallback(async () => {
    if (!demandaId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch demand details
      const { data, error } = await supabase
        .from('demandas')
        .select('*, demanda_perguntas(*), demanda_arquivos(*)')
        .eq('id', demandaId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setDemanda(data as unknown as Demanda);
        
        // Check if a press release already exists for this demand
        const { data: notaData, error: notaError } = await supabase
          .from('notas_oficiais')
          .select('*')
          .eq('demanda_id', demandaId)
          .maybeSingle();
        
        if (notaError) {
          console.error('Erro ao verificar nota existente:', notaError);
        }
        
        setNotaExistente(notaData as NotaOficial | null);
        setCheckingNota(false);
      }
    } catch (err) {
      const errorMsg = (err as Error).message || 'Falha ao carregar detalhes da demanda';
      setError(errorMsg);
      toast({
        title: 'Erro!',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [demandaId, toast]);
  
  useEffect(() => {
    fetchDemandaDetalhes();
  }, [fetchDemandaDetalhes]);
  
  return {
    demanda,
    loading,
    error,
    notaExistente,
    checkingNota
  };
};
