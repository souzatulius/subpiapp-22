
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

// Define the NotaOficial type
interface NotaOficial {
  id: string;
  demanda_id: string;
  conteudo: string;
  criado_em: string;
  criado_por: string;
  status: string;
  ultima_atualizacao: string;
}

// Define the Demanda type
interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  solicitante_id: string | null;
  solicitante_nome: string | null;
  solicitante_email: string | null;
  solicitante_telefone: string | null;
  criado_em: string;
  ultima_atualizacao: string;
  status: string;
  prazo: string | null;
  origem_id: string | null;
  servico_id: string | null;
  tipo_midia_id: string | null;
  prioridade: string | null;
  distrito_id: string | null;
  bairro_id: string | null;
  local: string | null;
  perguntas: Record<string, any>[] | null;
}

export interface DetalhesResult {
  demanda: Demanda | null;
  notas: NotaOficial[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and managing details for a specific demand
 */
export const useDemandaDetalhes = (demandaId: string): DetalhesResult => {
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDemandaDetalhes = async () => {
      try {
        setLoading(true);
        
        // Fetch demanda details
        const { data: demandaData, error: demandaError } = await supabase
          .from('demandas')
          .select('*')
          .eq('id', demandaId)
          .single();

        if (demandaError) {
          console.error('Erro ao buscar detalhes da demanda:', demandaError);
          setError('Erro ao buscar detalhes da demanda');
          toast({
            title: "Erro ao buscar detalhes da demanda",
            description: demandaError.message,
            variant: "destructive",
          });
          return;
        }

        setDemanda(demandaData as Demanda);

        // Fetch notas oficiais related to the demanda
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('*')
          .eq('demanda_id', demandaId)
          .order('criado_em', { ascending: false });

        if (notasError) {
          console.error('Erro ao buscar notas oficiais:', notasError);
          toast({
            title: "Erro ao buscar notas oficiais",
            description: notasError.message,
            variant: "destructive",
          });
        } else {
          setNotas(notasData as NotaOficial[]);
        }
      } catch (err: any) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao buscar detalhes');
        toast({
          title: "Erro inesperado",
          description: err.message || "Ocorreu um erro ao buscar os detalhes da demanda",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (demandaId) {
      fetchDemandaDetalhes();
    }
  }, [demandaId, toast]);

  return { demanda, notas, loading, error };
};

export default useDemandaDetalhes;
