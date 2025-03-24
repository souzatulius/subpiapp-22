
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
          .from('problemas')
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
        const {
          data,
          error
        } = await supabase.from('demandas').select(`
            *,
            problemas (id, descricao),
            origens_demandas (descricao),
            tipos_midia (descricao),
            servicos (descricao)
          `)
          .eq('status', 'pendente')
          .order('prioridade', {
            ascending: false
          })
          .order('prazo_resposta', {
            ascending: true
          });
          
        if (error) throw error;
        
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
          
        if (notasError) throw notasError;
        
        const demandasComNotas = new Set(notasData?.map(nota => nota.demanda_id).filter(Boolean) || []);
        
        const filteredDemandas = data?.filter(demanda => !demandasComNotas.has(demanda.id)) || [];
        
        // Type assertion to make TypeScript happy
        const typedDemandas = filteredDemandas.map(demanda => {
          // Ensure perguntas is in the correct format
          let parsedPerguntas = demanda.perguntas;
          if (typeof parsedPerguntas === 'string') {
            try {
              parsedPerguntas = JSON.parse(parsedPerguntas);
            } catch (e) {
              parsedPerguntas = null;
            }
          }
          
          return {
            ...demanda,
            perguntas: parsedPerguntas
          } as Demanda;
        });
        
        setDemandas(typedDemandas);
        setFilteredDemandas(typedDemandas);
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
      filtered = filtered.filter(demanda => demanda.problemas?.id === areaFilter);
    }
    
    if (prioridadeFilter) {
      filtered = filtered.filter(demanda => demanda.prioridade === prioridadeFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        demanda => demanda.titulo.toLowerCase().includes(searchLower) || 
                  demanda.problemas?.descricao.toLowerCase().includes(searchLower) ||
                  demanda.servicos?.descricao?.toLowerCase().includes(searchLower)
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
