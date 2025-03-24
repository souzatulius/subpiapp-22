
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Demanda, AreasCoordinacao, Origem, Filter } from '../types';

export const useDemandasData = (initialFilter: Filter = 'all') => {
  const { user } = useAuth();
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [areasCoordinacao, setAreasCoordinacao] = useState<AreasCoordinacao[]>([]);
  const [origens, setOrigens] = useState<Origem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);

  // Fetch demandas and filter options
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch áreas de coordenação
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('*');
        
        if (areasError) throw areasError;
        setAreasCoordinacao(areasData || []);
        
        // Fetch origens
        const { data: origensData, error: origensError } = await supabase
          .from('origens_demanda')
          .select('*');
        
        if (origensError) throw origensError;
        setOrigens(origensData || []);
        
        // Fetch demandas pendentes
        const { data: demandasData, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            *,
            origem:origem_id (descricao),
            area_coordenacao:area_coordenacao_id (id, descricao),
            servico:servico_id (descricao),
            tipo_midia:tipo_midia_id (descricao),
            bairro:bairro_id (nome, distrito_id),
            autor:autor_id (nome),
            arquivo_url
          `)
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false });
        
        if (demandasError) throw demandasError;
        
        // Get current user's area_coordenacao_id
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('area_coordenacao_id')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        // Filter demandas for user's area if they're not admin
        let userDemandas = demandasData || [];
        
        if (userData && userData.area_coordenacao_id) {
          // Filter for user's area unless they're admin
          const { data: userRoles } = await supabase
            .from('perfis_usuarios')
            .select('perfil_id')
            .eq('usuario_id', user.id);
          
          const isAdmin = userRoles?.some(role => role.perfil_id === 1);
          
          if (!isAdmin) {
            userDemandas = userDemandas.filter(
              demanda => demanda.area_coordenacao_id === userData.area_coordenacao_id
            );
          }
        }
        
        setDemandas(userDemandas);
        setFilteredDemandas(userDemandas);
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        toast.error("Erro ao carregar dados", {
          description: error.message || "Ocorreu um erro ao carregar as demandas. Por favor, tente novamente."
        });
      } finally {
        setIsLoading(false);
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
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(demanda => 
        demanda.titulo.toLowerCase().includes(searchLower) ||
        demanda.area_coordenacao?.descricao.toLowerCase().includes(searchLower) ||
        demanda.servico?.descricao.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredDemandas(filtered);
  }, [filter, searchTerm, demandas]);

  // Get counts by priority
  const counts = useMemo(() => {
    return {
      all: demandas.length,
      alta: demandas.filter(d => d.prioridade === 'alta').length,
      media: demandas.filter(d => d.prioridade === 'media').length,
      baixa: demandas.filter(d => d.prioridade === 'baixa').length
    };
  }, [demandas]);

  return {
    demandas,
    setDemandas,
    filteredDemandas,
    setFilteredDemandas,
    areasCoordinacao,
    origens,
    isLoading,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    counts,
    selectedDemanda,
    setSelectedDemanda
  };
};
