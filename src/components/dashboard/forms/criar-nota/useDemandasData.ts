
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Demand } from '../types';

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch demandas
  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        // First, fetch all demandas that are either pendente or em_andamento
        const { data: allDemandas, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            perguntas,
            problema_id,
            problemas:problema_id(id, descricao)
          `)
          .in('status', ['pendente', 'em_andamento', 'respondida'])
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) throw demandasError;
        
        // Fetch all notas oficiais to check which demandas already have notas
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
        
        if (notasError) throw notasError;
        
        // Create a set of demanda IDs that already have notas
        const demandasComNotas = new Set(notasData?.map(nota => nota.demanda_id).filter(Boolean) || []);
        
        console.log('All demandas:', allDemandas.length);
        console.log('Demandas with notas:', demandasComNotas.size);
        console.log('Demandas without notas:', allDemandas.length - demandasComNotas.size);
        
        // Filter to include only demandas that don't have notas associated
        const demandasSemNotas = allDemandas.filter(demanda => !demandasComNotas.has(demanda.id));
        
        // Make sure the perguntas field is properly typed and map to include Demand type fields
        const typedData: Demand[] = demandasSemNotas?.map(item => ({
          id: item.id,
          titulo: item.titulo,
          status: item.status,
          problema_id: item.problema_id,
          problema: item.problemas,
          detalhes_solicitacao: item.detalhes_solicitacao,
          perguntas: item.perguntas as Record<string, string> | null
        })) || [];
        
        setDemandas(typedData);
        setFilteredDemandas(typedData);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Não foi possível carregar as demandas disponíveis.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, []);

  // Filter demandas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(demanda => 
      demanda.titulo.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.problema?.descricao?.toLowerCase().includes(lowercaseSearchTerm)
    );
    
    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  return {
    demandas,
    filteredDemandas,
    searchTerm,
    setSearchTerm,
    isLoading
  };
};
