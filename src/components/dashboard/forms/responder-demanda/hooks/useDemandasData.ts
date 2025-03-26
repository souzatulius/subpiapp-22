
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demanda, Area, ViewMode } from '../types';

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState<boolean>(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("all");

  // Fetch demandas
  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoadingDemandas(true);
        
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            detalhes_solicitacao,
            prazo_resposta,
            prioridade,
            perguntas,
            status,
            areas_coordenacao:area_coordenacao_id (id, descricao),
            origens_demandas:origem_id (id, descricao),
            tipos_midia:tipo_midia_id (id, descricao)
          `)
          .eq('status', 'pendente');
        
        if (error) {
          console.error('Error fetching demandas:', error);
          return;
        }
        
        setDemandas(data || []);
        setFilteredDemandas(data || []);
      } catch (error) {
        console.error('Error in fetchDemandas:', error);
      } finally {
        setIsLoadingDemandas(false);
      }
    };
    
    fetchDemandas();
  }, []);

  // Fetch areas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('areas_coordenacao')
          .select('*');
        
        if (error) {
          console.error('Error fetching areas:', error);
          return;
        }
        
        setAreas(data || []);
      } catch (error) {
        console.error('Error in fetchAreas:', error);
      }
    };
    
    fetchAreas();
  }, []);

  // Filter demandas based on search, area, and prioridade
  useEffect(() => {
    if (!demandas) return;
    
    let filtered = [...demandas];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(demanda => 
        demanda.titulo.toLowerCase().includes(searchLower) ||
        (demanda.detalhes_solicitacao && demanda.detalhes_solicitacao.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply area filter
    if (areaFilter && areaFilter !== "all") {
      filtered = filtered.filter(demanda => 
        demanda.areas_coordenacao && demanda.areas_coordenacao.id === areaFilter
      );
    }
    
    // Apply prioridade filter
    if (prioridadeFilter && prioridadeFilter !== "all") {
      filtered = filtered.filter(demanda => 
        demanda.prioridade === prioridadeFilter
      );
    }
    
    setFilteredDemandas(filtered);
  }, [demandas, searchTerm, areaFilter, prioridadeFilter]);

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
