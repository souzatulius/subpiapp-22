
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';

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
        
        // Primeiro buscamos as demandas que estão pendentes ou em andamento
        const { data: allDemandas, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            perguntas,
            supervisao_tecnica_id
          `)
          .in('status', ['pendente', 'em_andamento', 'respondida'])
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) throw demandasError;
        
        // Buscar todas as notas oficiais para verificar quais demandas já possuem notas
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
        
        if (notasError) throw notasError;
        
        // Criar um conjunto de IDs de demandas que já possuem notas
        const demandasComNotas = new Set(notasData?.map(nota => nota.demanda_id).filter(Boolean) || []);
        
        // Filtrar para incluir apenas demandas que não possuem notas associadas
        const demandasSemNotas = allDemandas.filter(demanda => !demandasComNotas.has(demanda.id));
        
        console.log('All demandas:', allDemandas.length);
        console.log('Demandas with notas:', demandasComNotas.size);
        console.log('Demandas without notas:', demandasSemNotas.length);
        
        // Buscar informações de área para cada demanda
        const demandasComArea = await Promise.all(
          demandasSemNotas.map(async (demanda) => {
            if (demanda.supervisao_tecnica_id) {
              const { data: areaData } = await supabase
                .from('supervisoes_tecnicas')
                .select('id, descricao')
                .eq('id', demanda.supervisao_tecnica_id)
                .single();
              
              return {
                ...demanda,
                area_coordenacao: areaData || null
              };
            }
            return {
              ...demanda,
              area_coordenacao: null
            };
          })
        );
        
        // Garantir que perguntas seja tratado corretamente
        const typedData = demandasComArea.map(item => ({
          ...item,
          perguntas: item.perguntas as Record<string, string> | null
        }));
        
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

  // Filtrar demandas baseado no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(demanda => 
      demanda.titulo.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.area_coordenacao?.descricao?.toLowerCase().includes(lowercaseSearchTerm)
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
