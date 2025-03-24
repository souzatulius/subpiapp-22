
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Demand } from './types';

export const useDemandasData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDemandas = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        const { data: problemasData, error: problemasError } = await supabase
          .from('problemas')
          .select('*');
        
        if (problemasError) throw problemasError;

        // Fetch demandas com status 'respondida'
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            *,
            problema:problema_id (*)
          `)
          .eq('status', 'respondida')
          .order('criado_em', { ascending: false });
        
        if (error) throw error;

        if (data) {
          // Transform data to match the Demand type
          const formattedDemandas: Demand[] = data.map(demanda => ({
            id: demanda.id,
            titulo: demanda.titulo,
            status: demanda.status,
            prioridade: demanda.prioridade,
            problema: demanda.problema,
            perguntas: demanda.perguntas ? demanda.perguntas as Record<string, string> : null,
            detalhes_solicitacao: demanda.detalhes_solicitacao || null,
            horario_publicacao: demanda.horario_publicacao,
            veiculo_imprensa: demanda.veiculo_imprensa,
            nome_solicitante: demanda.nome_solicitante,
            email_solicitante: demanda.email_solicitante,
            telefone_solicitante: demanda.telefone_solicitante,
            endereco: demanda.endereco,
            criado_em: demanda.criado_em
          }));

          setDemandas(formattedDemandas);
          setFilteredDemandas(formattedDemandas);
        }
      } catch (error: any) {
        console.error('Erro ao buscar demandas:', error);
        toast.error("Erro ao carregar demandas", {
          description: error.message || "Ocorreu um erro ao buscar as demandas respondidas."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, [user]);

  // Filter demandas based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDemandas(demandas);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = demandas.filter(demanda => 
      demanda.titulo.toLowerCase().includes(lowercasedSearch) ||
      demanda.problema?.descricao.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  return {
    isLoading,
    demandas,
    filteredDemandas,
    searchTerm,
    setSearchTerm
  };
};
