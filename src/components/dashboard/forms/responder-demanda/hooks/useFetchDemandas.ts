
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demanda } from '../types';
import { useFeedback } from '@/components/ui/feedback-provider';

// Define a type for the error object
interface GenericError {
  message: string;
  id?: string;
}

export const useFetchDemandas = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<GenericError | null>(null);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        // Fetch demandas that aren't answered yet
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            *,
            tema:tema_id (*),
            problema:problema_id (*),
            coordenacao:coordenacao_id (*)
          `)
          .in('status', ['pendente', 'novo'])
          .order('horario_publicacao', { ascending: false });

        if (error) {
          throw { message: error.message, id: error.code };
        }

        if (data) {
          // Process each demanda to normalize its structure
          const processedDemandas = data.map(demanda => {
            // Handle potential fields that may be null or not properly structured
            // Ensure perguntas is a Record<string, string> or empty object
            const perguntas = demanda.perguntas ? 
              (typeof demanda.perguntas === 'object' ? demanda.perguntas : {}) : 
              {};
            
            // Create a new object with correct types
            const processedDemanda: Demanda = {
              ...demanda,
              perguntas: perguntas as Record<string, string>,
              anexos: demanda.anexos || []
            };
            
            // Make sure tema has the correct structure
            if (demanda.tema && typeof demanda.tema === 'object') {
              processedDemanda.tema = {
                id: demanda.tema.id || '',
                descricao: demanda.tema.descricao || '',
                coordenacao: demanda.tema.coordenacao || null
              };
            } else {
              // If tema is null or not an object, set it to null
              processedDemanda.tema = null;
            }
            
            return processedDemanda;
          });
          
          setDemandas(processedDemandas);
        }
      } catch (err: any) {
        const errorObj: GenericError = { 
          message: err.message || 'Erro ao carregar demandas',
          id: err.id
        };
        setError(errorObj);
        showFeedback('error', `Erro ao carregar demandas: ${errorObj.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, [showFeedback]);

  return {
    demandas,
    setDemandas,
    isLoading,
    error,
    isError: !!error
  };
};
