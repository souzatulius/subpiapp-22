
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Demanda, Filter, Problema } from '../types';

export const useDemandasData = (initialFilter: Filter = 'all') => {
  const { user } = useAuth();
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [origens, setOrigens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('');
  const [areas, setAreas] = useState<Problema[]>([]);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState(true);

  // Fetch demandas and filter options
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setIsLoadingDemandas(true);
        
        // Fetch problemas (formerly areas_coordenacao)
        const { data: problemasData, error: problemasError } = await supabase
          .from('problemas')
          .select('*');
        
        if (problemasError) throw problemasError;
        setProblemas(problemasData || []);
        setAreas(problemasData || []);
        
        // Fetch origens
        const { data: origensData, error: origensError } = await supabase
          .from('origens_demandas')
          .select('*');
        
        if (origensError) throw origensError;
        setOrigens(origensData || []);
        
        // Fetch demandas pendentes
        const { data: demandasData, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            *,
            problema:problema_id (id, descricao),
            origens_demandas:origem_id (descricao),
            servicos:servico_id (descricao),
            tipos_midia:tipo_midia_id (descricao),
            bairro:bairro_id (nome, distrito_id),
            autor:autor_id (nome_completo)
          `)
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false });
        
        if (demandasError) throw demandasError;
        
        // Get current user's problema_id
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('problema_id')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        // Filter demandas for user's area if they're not admin
        let userDemandas = demandasData || [];
        
        if (userData && userData.problema_id) {
          // Filter for user's area unless they're admin
          const { data: userRoles } = await supabase
            .from('usuario_permissoes')
            .select('permissao_id')
            .eq('usuario_id', user.id);
          
          const isAdmin = userRoles?.some(role => role.permissao_id === '1');
          
          if (!isAdmin) {
            userDemandas = userDemandas.filter(
              demanda => demanda.problema_id === userData.problema_id
            );
          }
        }
        
        // Transform the data to match our Demanda type
        const typedDemandas: Demanda[] = userDemandas.map(demanda => ({
          id: demanda.id,
          titulo: demanda.titulo,
          status: demanda.status,
          prioridade: demanda.prioridade,
          prazo_resposta: demanda.prazo_resposta,
          perguntas: demanda.perguntas as Record<string, string> | string[] | null,
          detalhes_solicitacao: demanda.detalhes_solicitacao,
          problema: demanda.problema,
          origens_demandas: demanda.origens_demandas,
          tipos_midia: demanda.tipos_midia,
          servicos: demanda.servicos,
          arquivo_url: demanda.arquivo_url,
          arquivo_nome: demanda.arquivo_nome || null // Handle the case if arquivo_nome doesn't exist
        }));
        
        setDemandas(typedDemandas);
        setFilteredDemandas(typedDemandas);
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        toast.error("Erro ao carregar dados", {
          description: error.message || "Ocorreu um erro ao carregar as demandas. Por favor, tente novamente."
        });
      } finally {
        setIsLoading(false);
        setIsLoadingDemandas(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Apply filters when filter or search term changes
  useEffect(() => {
    let filtered = [...demandas];
    
    // Apply priority filter
    if (filter !== 'all') {
      filtered = filtered.filter(demanda => demanda.prioridade === filter);
    }
    
    // Apply area filter
    if (areaFilter) {
      filtered = filtered.filter(demanda => 
        demanda.problema?.id === areaFilter
      );
    }
    
    // Apply prioridade filter
    if (prioridadeFilter) {
      filtered = filtered.filter(demanda => 
        demanda.prioridade === prioridadeFilter
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(demanda => 
        demanda.titulo.toLowerCase().includes(searchLower) ||
        demanda.problema?.descricao.toLowerCase().includes(searchLower) ||
        demanda.servicos?.descricao.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredDemandas(filtered);
  }, [filter, searchTerm, demandas, areaFilter, prioridadeFilter]);

  // Get counts by priority
  const counts = useMemo(() => {
    return {
      all: demandas.length,
      alta: demandas.filter(d => d.prioridade === 'alta').length,
      media: demandas.filter(d => d.prioridade === 'media').length,
      baixa: demandas.filter(d => d.prioridade === 'baixa').length
    };
  }, [demandas]);

  const handleSelectDemanda = (demanda: Demanda) => {
    setSelectedDemanda(demanda);
  };

  return {
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas,
    problemas,
    origens,
    isLoading,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    counts,
    selectedDemanda,
    setSelectedDemanda,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter,
    areas,
    isLoadingDemandas,
    handleSelectDemanda
  };
};
