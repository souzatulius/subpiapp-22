
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface QuickDemandData {
  titulo: string;
  detalhes: string;
}

export const useQuickDemand = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const submitQuickDemand = async (data: QuickDemandData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    try {
      // Store basic information for the quick demand
      // This will be completed later in the full form
      const { error } = await supabase.from('demandas').insert({
        titulo: data.titulo,
        detalhes_solicitacao: data.detalhes,
        autor_id: user.id,
        status: 'rascunho', // Special status for quick demands that aren't fully completed
        // Set minimal required fields with defaults
        prioridade: 'normal',
        origem_id: '00000000-0000-0000-0000-000000000000', // Will be updated in full form
        problema_id: '00000000-0000-0000-0000-000000000000', // Will be updated in full form
        prazo_resposta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
      });

      if (error) throw error;
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submitQuickDemand };
};
