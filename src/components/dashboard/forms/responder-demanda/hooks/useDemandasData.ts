
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demanda, Area } from '../types';

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('');

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao')
          .order('descricao');
          
        if (error) throw error;
        setAreas(data || []);
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
      }
    };
    
    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoadingDemandas(true);
        
        // Buscar todas as demandas pendentes
        const { data: demandasData, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            *,
            origens_demandas(descricao),
            tipos_midia(descricao)
          `)
          .eq('status', 'pendente')
          .order('prioridade', { ascending: false })
          .order('prazo_resposta', { ascending: true });
          
        if (demandasError) throw demandasError;
        
        // Verificar notas existentes
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
          
        if (notasError) throw notasError;
        
        // Filtrar demandas que já têm notas
        const demandasComNotas = new Set(notasData?.map(nota => nota.demanda_id).filter(Boolean) || []);
        const filteredDemandas = demandasData?.filter(demanda => !demandasComNotas.has(demanda.id)) || [];
        
        // Processar as demandas para adicionar informações de área
        const processedDemandas = await Promise.all(
          filteredDemandas.map(async (demanda: any) => {
            // Garantir que perguntas esteja no formato correto
            let parsedPerguntas = demanda.perguntas;
            if (typeof parsedPerguntas === 'string') {
              try {
                parsedPerguntas = JSON.parse(parsedPerguntas);
              } catch (e) {
                parsedPerguntas = null;
              }
            }
            
            // Buscar supervisão técnica
            let areaInfo = null;
            if (demanda.supervisao_tecnica_id) {
              const { data: areaData } = await supabase
                .from('supervisoes_tecnicas')
                .select('id, descricao')
                .eq('id', demanda.supervisao_tecnica_id)
                .single();
                
              if (areaData) {
                areaInfo = {
                  id: areaData.id,
                  descricao: areaData.descricao
                };
              }
            }
            
            return {
              ...demanda,
              perguntas: parsedPerguntas,
              areas_coordenacao: areaInfo
            } as unknown as Demanda;
          })
        );
        
        setDemandas(processedDemandas);
        setFilteredDemandas(processedDemandas);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Não foi possível carregar as demandas pendentes.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingDemandas(false);
      }
    };
    fetchDemandas();
  }, []);

  useEffect(() => {
    let filtered = [...demandas];
    
    if (areaFilter) {
      filtered = filtered.filter(demanda => demanda.areas_coordenacao?.id === areaFilter);
    }
    
    if (prioridadeFilter) {
      filtered = filtered.filter(demanda => demanda.prioridade === prioridadeFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        demanda => demanda.titulo.toLowerCase().includes(searchLower) || 
                  demanda.areas_coordenacao?.descricao.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredDemandas(filtered);
  }, [demandas, areaFilter, prioridadeFilter, searchTerm]);

  const handleSelectDemanda = (demanda: Demanda) => {
    setSelectedDemanda(demanda);
  };

  return {
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas,
    selectedDemanda,
    setSelectedDemanda,
    isLoadingDemandas,
    areas,
    searchTerm,
    setSearchTerm,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter,
    handleSelectDemanda
  };
};
