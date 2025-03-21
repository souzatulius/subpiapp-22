
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';

export const useDemandasQuery = () => {
  return useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      console.log('Fetching demandas');
      // First fetch all demandas
      const {
        data: allDemandas,
        error: demandasError
      } = await supabase.from('demandas').select(`
          *,
          area_coordenacao:area_coordenacao_id(descricao),
          servico:servico_id(descricao),
          origem:origem_id(descricao),
          tipo_midia:tipo_midia_id(descricao),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo)
        `).order('horario_publicacao', {
        ascending: false
      });
      
      if (demandasError) {
        console.error('Error fetching demandas:', demandasError);
        throw demandasError;
      }
      
      // Now fetch all notas to update the demandas that have notas
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('id, demanda_id, status');
        
      if (notasError) {
        console.error('Error fetching notas:', notasError);
        throw notasError;
      }
      
      // Create a map of demanda_id to nota status for quick lookup
      const demandaToNotaStatus = new Map();
      notasData?.forEach(nota => {
        if (nota.demanda_id) {
          // If there are multiple notas for a demanda, use the most "advanced" status
          // Priority: aprovada > pendente > rejeitada
          const currentStatus = demandaToNotaStatus.get(nota.demanda_id);
          if (!currentStatus || 
              (currentStatus !== 'aprovado' && nota.status === 'aprovado') ||
              (currentStatus === 'rejeitado' && nota.status === 'pendente')) {
            demandaToNotaStatus.set(nota.demanda_id, nota.status);
          }
        }
      });
      
      // Update demanda status based on nota status
      const updatedDemandas = allDemandas?.map(demanda => {
        const notaStatus = demandaToNotaStatus.get(demanda.id);
        
        // If this demanda has a nota, update its status based on the nota's status
        if (notaStatus) {
          let updatedStatus = demanda.status;
          
          if (notaStatus === 'aprovado') {
            updatedStatus = 'nota_aprovada';
          } else if (notaStatus === 'pendente') {
            updatedStatus = 'nota_criada';
          } else if (notaStatus === 'rejeitado') {
            updatedStatus = 'nota_rejeitada';
          }
          
          return {
            ...demanda,
            status: updatedStatus
          };
        }
        
        return demanda;
      });
      
      console.log('Demandas data:', updatedDemandas);
      const processedData = updatedDemandas?.map(item => {
        if (typeof item.perguntas === 'string') {
          try {
            item.perguntas = JSON.parse(item.perguntas);
          } catch (e) {
            item.perguntas = null;
          }
        }
        return item;
      }) || [];
      
      return processedData as Demand[];
    },
    meta: {
      onError: (err: any) => {
        console.error('Query error:', err);
        toast({
          title: "Erro ao carregar demandas",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });
};
