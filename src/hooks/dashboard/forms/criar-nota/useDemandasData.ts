
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

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
        
        // Primeiro buscamos as demandas que estão pendentes ou em andamento ou respondidas
        const { data: allDemandas, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            resumo_situacao,
            perguntas,
            problema_id,
            coordenacao_id,
            servico_id,
            arquivo_url,
            anexos,
            protocolo,
            horario_publicacao,
            prazo_resposta,
            prioridade
          `)
          .in('status', ['pendente', 'em_andamento', 'respondida'])
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) {
          console.error('Error fetching demandas:', demandasError);
          throw demandasError;
        }
        
        // Verify that allDemandas is an array before continuing
        if (!allDemandas || !Array.isArray(allDemandas)) {
          console.error('Demandas data is not an array:', allDemandas);
          throw new Error('Failed to fetch demandas: Invalid data format');
        }
        
        // Buscar todas as notas oficiais para verificar quais demandas já possuem notas
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
        
        if (notasError) {
          console.error('Error fetching notas:', notasError);
          throw notasError;
        }
        
        // Verify that notasData is an array before continuing
        if (!notasData || !Array.isArray(notasData)) {
          console.error('Notas data is not an array:', notasData);
          throw new Error('Failed to fetch notas: Invalid data format');
        }
        
        // Criar um conjunto de IDs de demandas que já possuem notas
        const demandasComNotas = new Set(notasData.map(nota => nota.demanda_id).filter(Boolean));
        
        // Filtrar para incluir APENAS demandas RESPONDIDAS que NÃO possuem notas associadas
        const demandasParaProcessar = allDemandas.filter(demanda => 
          demanda.status === 'respondida' && !demandasComNotas.has(demanda.id)
        );
        
        console.log('All demandas:', allDemandas.length);
        console.log('Demandas with status "respondida":', allDemandas.filter(d => d.status === 'respondida').length);
        console.log('Demandas with notas:', demandasComNotas.size);
        console.log('Demandas respondidas without notas:', demandasParaProcessar.length);
        
        // Buscar informações do problema para cada demanda
        const demandasProcessadas = await Promise.all(
          demandasParaProcessar.map(async (demanda) => {
            let problemaData = null;
            
            if (demanda.problema_id) {
              const { data } = await supabase
                .from('problemas')
                .select('id, descricao, coordenacao_id')
                .eq('id', demanda.problema_id)
                .single();
                
              problemaData = data;
            }
            
            // Criar objeto completo da demanda com todas as propriedades necessárias
            return {
              ...demanda,
              supervisao_tecnica: null, // Mantemos esse campo para compatibilidade, mas como null
              area_coordenacao: problemaData ? { descricao: problemaData.descricao } : null,
              tema: problemaData ? { descricao: problemaData.descricao } : null,
              servico: null,
              endereco: null,
              nome_solicitante: null,
              email_solicitante: null,
              telefone_solicitante: null,
              veiculo_imprensa: null,
              origem: null,
              tipo_midia: null,
              bairro: null,
              autor: null,
              problema: { descricao: problemaData?.descricao || null },
              // Make sure these properties exist and are set properly
              arquivo_url: demanda.arquivo_url || null,
              anexos: demanda.anexos || null,
              numero_protocolo_156: demanda.protocolo || null
            } as Demand;
          })
        );
        
        setDemandas(demandasProcessadas);
        setFilteredDemandas(demandasProcessadas);
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
