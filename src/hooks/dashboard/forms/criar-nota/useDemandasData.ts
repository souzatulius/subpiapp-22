
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
        
        // Buscar demandas que estão respondidas ou aguardando nota
        const { data: allDemandas, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            perguntas,
            problema_id,
            coordenacao_id,
            servico_id,
            arquivo_url,
            anexos
          `)
          .in('status', ['respondida', 'aguardando_nota'])
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
        
        console.log('Total de demandas respondidas:', allDemandas.length);
        console.log('Demandas com notas:', demandasComNotas.size);
        console.log('Demandas disponíveis para criar nota:', demandasSemNotas.length);
        
        // Buscar informações do problema para cada demanda
        const demandasProcessadas = await Promise.all(
          demandasSemNotas.map(async (demanda) => {
            if (demanda.problema_id) {
              const { data: problemaData } = await supabase
                .from('problemas')
                .select('id, descricao, coordenacao_id')
                .eq('id', demanda.problema_id)
                .single();
              
              // Criar objeto completo da demanda com todas as propriedades necessárias
              return {
                ...demanda,
                supervisao_tecnica: null, // Mantemos esse campo para compatibilidade, mas como null
                area_coordenacao: problemaData ? { descricao: problemaData.descricao } : null,
                prioridade: "",
                horario_publicacao: "",
                prazo_resposta: "",
                endereco: null,
                nome_solicitante: null,
                email_solicitante: null,
                telefone_solicitante: null,
                veiculo_imprensa: null,
                origem: null,
                tipo_midia: null,
                bairro: null,
                autor: null,
                servico: null,
                // Garantir que esses campos existam
                arquivo_url: demanda.arquivo_url || null,
                anexos: demanda.anexos || []
              } as Demand;
            }
            
            // Se não tiver problema, criar objeto com valores padrão
            return {
              ...demanda,
              supervisao_tecnica: null,
              area_coordenacao: null,
              prioridade: "",
              horario_publicacao: "",
              prazo_resposta: "",
              endereco: null,
              nome_solicitante: null,
              email_solicitante: null,
              telefone_solicitante: null,
              veiculo_imprensa: null,
              origem: null,
              tipo_midia: null,
              bairro: null,
              autor: null,
              servico: null,
              arquivo_url: demanda.arquivo_url || null,
              anexos: demanda.anexos || []
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
      demanda.titulo?.toLowerCase().includes(lowercaseSearchTerm) ||
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
