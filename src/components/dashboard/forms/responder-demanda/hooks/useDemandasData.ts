
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demanda, Area, ViewMode } from '../types';
import { toast } from '@/components/ui/use-toast';

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
            horario_publicacao,
            endereco,
            nome_solicitante,
            email_solicitante,
            telefone_solicitante,
            veiculo_imprensa,
            arquivo_url,
            supervisao_tecnica_id,
            origem_id,
            tipo_midia_id,
            bairro_id,
            autor_id,
            problema_id,
            servico_id,
            protocolo,
            area_coordenacao_id:supervisao_tecnica_id (id, descricao),
            origens_demandas:origem_id (id, descricao),
            tipos_midia:tipo_midia_id (id, descricao),
            bairros:bairro_id (id, nome)
          `)
          .order('horario_publicacao', { ascending: false });
        
        if (error) {
          console.error('Error fetching demandas:', error);
          toast({
            title: "Erro ao carregar demandas",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        // Transform the data to match the Demanda type
        const transformedData: Demanda[] = (data || []).map(item => {
          // Handle perguntas type conversion: ensure it's string[] or null
          let perguntasArray: string[] | null = null;
          if (item.perguntas) {
            // If it's an array already, use it
            if (Array.isArray(item.perguntas)) {
              perguntasArray = item.perguntas as string[];
            }
            // If it's a string, try to parse it or convert to array with one element
            else if (typeof item.perguntas === 'string') {
              try {
                const parsed = JSON.parse(item.perguntas);
                perguntasArray = Array.isArray(parsed) ? parsed : [item.perguntas];
              } catch {
                perguntasArray = [item.perguntas];
              }
            }
            // For other cases, convert to empty array
            else {
              console.warn('Unexpected perguntas format:', item.perguntas);
              perguntasArray = [];
            }
          }
          
          return {
            id: item.id,
            titulo: item.titulo,
            detalhes_solicitacao: item.detalhes_solicitacao,
            prazo_resposta: item.prazo_resposta,
            prioridade: item.prioridade,
            perguntas: perguntasArray,
            status: item.status,
            horario_publicacao: item.horario_publicacao,
            endereco: item.endereco,
            nome_solicitante: item.nome_solicitante,
            email_solicitante: item.email_solicitante,
            telefone_solicitante: item.telefone_solicitante,
            veiculo_imprensa: item.veiculo_imprensa,
            arquivo_url: item.arquivo_url,
            supervisao_tecnica_id: item.supervisao_tecnica_id,
            bairro_id: item.bairro_id,
            autor_id: item.autor_id,
            tipo_midia_id: item.tipos_midia?.id,
            origem_id: item.origens_demandas?.id,
            problema_id: item.problema_id,
            servico_id: item.servico_id,
            protocolo: item.protocolo,
            areas_coordenacao: item.area_coordenacao_id,
            origens_demandas: item.origens_demandas,
            tipos_midia: item.tipos_midia,
            bairros: item.bairros
          };
        });
        
        setDemandas(transformedData);
        setFilteredDemandas(transformedData);
      } catch (error) {
        console.error('Error in fetchDemandas:', error);
        toast({
          title: "Erro ao carregar demandas",
          description: "Ocorreu um erro ao carregar as demandas.",
          variant: "destructive"
        });
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
          toast({
            title: "Erro ao carregar áreas",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        setAreas(data || []);
      } catch (error) {
        console.error('Error in fetchAreas:', error);
        toast({
          title: "Erro ao carregar áreas",
          description: "Ocorreu um erro ao carregar as áreas.",
          variant: "destructive"
        });
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
