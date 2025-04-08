
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
            anexos,
            prazo_resposta,
            prioridade,
            nome_solicitante,
            telefone_solicitante,
            email_solicitante,
            veiculo_imprensa,
            endereco,
            bairro_id,
            tipo_midia_id,
            origem_id,
            protocolo,
            bairros:bairro_id(
              id, 
              nome,
              distrito_id,
              distritos:distrito_id(id, nome)
            ),
            origens_demandas:origem_id(id, descricao),
            tipos_midia:tipo_midia_id(id, descricao),
            servicos:servico_id(id, descricao),
            problemas:problema_id(id, descricao)
          `)
          .in('status', ['respondida', 'aguardando_nota'])
          .order('created_at', { ascending: false });
        
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
        
        // Processar as demandas para o formato correto
        const demandasProcessadas = demandasSemNotas.map(demanda => {
          return {
            ...demanda,
            supervisao_tecnica: null,
            area_coordenacao: demanda.problemas 
              ? { descricao: demanda.problemas.descricao } 
              : null,
            origem: demanda.origens_demandas,
            tipo_midia: demanda.tipos_midia,
            bairro: demanda.bairros,
            autor: null,
            servico: demanda.servicos,
            problema: {
              descricao: demanda.problemas?.descricao || null
            },
            horario_publicacao: "", // Add default value
            arquivo_url: demanda.arquivo_url || null,
            anexos: demanda.anexos || [],
            protocolo: demanda.protocolo || null
          } as Demand;
        });
        
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
      demanda.area_coordenacao?.descricao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.origem?.descricao?.toLowerCase().includes(lowercaseSearchTerm) ||
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
