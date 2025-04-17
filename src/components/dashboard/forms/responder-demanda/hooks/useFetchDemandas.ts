
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demanda } from '../types';

export const useFetchDemandas = (coordenacaoId?: string) => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);

        // Build query to fetch demands with all necessary relationships
        const query = supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            detalhes_solicitacao,
            resumo_situacao,
            horario_publicacao,
            prazo_resposta,
            prioridade,
            coordenacao_id,
            origem_id,
            origens_demandas:origem_id(id, descricao),
            tipo_midia_id,
            tipo_midia:tipo_midia_id(id, descricao),
            tema:problema_id(
              id,
              descricao,
              coordenacao:coordenacao_id(
                sigla,
                descricao,
                id
              )
            ),
            problema:problema_id(
              id,
              descricao,
              coordenacao:coordenacao_id(
                sigla,
                descricao,
                id
              )
            ),
            coordenacao:coordenacao_id(
              sigla,
              descricao,
              id
            ),
            bairro_id,
            bairros:bairro_id(
              id, 
              nome, 
              distrito_id
            ),
            distrito:bairros(
              distrito:distrito_id(
                id,
                nome
              )
            ),
            servico_id,
            servico:servico_id(id, descricao),
            veiculo_imprensa,
            nome_solicitante,
            email_solicitante,
            telefone_solicitante,
            protocolo,
            endereco,
            perguntas,
            anexos,
            arquivo_url
          `)
          .eq('status', 'pendente');

        // Apply coordination filter if provided
        if (coordenacaoId) {
          query.eq('coordenacao_id', coordenacaoId);
        }

        // Order by creation date, newest first
        query.order('horario_publicacao', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching demandas:', error);
          throw error;
        }

        // Verify data is an array
        if (!data || !Array.isArray(data)) {
          console.error('Demandas data is not an array:', data);
          throw new Error('Failed to fetch demandas: Invalid data format');
        }

        // Format the data to match the Demanda interface
        const formattedDemandas = data.map((demanda): Demanda => {
          // Process perguntas to ensure it's a Record<string, string> or null
          let processedPerguntas: Record<string, string> | null = null;
          
          if (demanda.perguntas) {
            // Check if it's already an object
            if (typeof demanda.perguntas === 'object' && !Array.isArray(demanda.perguntas)) {
              processedPerguntas = demanda.perguntas as Record<string, string>;
            } 
            // If it's a string, try to parse it as JSON
            else if (typeof demanda.perguntas === 'string') {
              try {
                const parsed = JSON.parse(demanda.perguntas);
                if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                  processedPerguntas = parsed;
                }
              } catch (e) {
                console.warn('Failed to parse perguntas string as JSON:', e);
              }
            }
          }
          
          return {
            id: demanda.id,
            titulo: demanda.titulo,
            status: demanda.status,
            detalhes_solicitacao: demanda.detalhes_solicitacao,
            resumo_situacao: demanda.resumo_situacao,
            horario_publicacao: demanda.horario_publicacao,
            prazo_resposta: demanda.prazo_resposta,
            prioridade: demanda.prioridade,
            coordenacao_id: demanda.coordenacao_id,
            origem_id: demanda.origem_id,
            origens_demandas: demanda.origens_demandas,
            tipo_midia_id: demanda.tipo_midia_id,
            tipo_midia: demanda.tipo_midia,
            tema: demanda.tema ? {
              id: demanda.tema.id,
              descricao: demanda.tema.descricao,
              coordenacao: demanda.tema.coordenacao
            } : null,
            problema: demanda.problema ? {
              id: demanda.problema.id,
              descricao: demanda.problema.descricao,
              coordenacao: demanda.problema.coordenacao
            } : null,
            coordenacao: demanda.coordenacao || {
              id: undefined,
              descricao: "Não definida",
              sigla: undefined
            },
            bairro_id: demanda.bairro_id,
            bairros: demanda.bairros,
            distrito: demanda.distrito?.[0]?.distrito || null,
            servico_id: demanda.servico_id,
            servico: demanda.servico,
            veiculo_imprensa: demanda.veiculo_imprensa,
            nome_solicitante: demanda.nome_solicitante, 
            email_solicitante: demanda.email_solicitante,
            telefone_solicitante: demanda.telefone_solicitante,
            protocolo: demanda.protocolo,
            endereco: demanda.endereco,
            perguntas: processedPerguntas,
            anexos: demanda.anexos,
            arquivo_url: demanda.arquivo_url
          };
        });

        console.log('Fetched and formatted demandas:', formattedDemandas);
        setDemandas(formattedDemandas);
        setFilteredDemandas(formattedDemandas);
      } catch (error) {
        console.error('Failed to fetch demandas:', error);
        toast({
          title: 'Erro ao carregar demandas',
          description: 'Não foi possível carregar a lista de demandas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, [coordenacaoId]);

  // Filter demands based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(
      (demanda) =>
        demanda.titulo.toLowerCase().includes(lowercaseSearchTerm) ||
        demanda.detalhes_solicitacao?.toLowerCase().includes(lowercaseSearchTerm) ||
        demanda.resumo_situacao?.toLowerCase().includes(lowercaseSearchTerm)
    );

    setFilteredDemandas(filtered);
  }, [searchTerm, demandas]);

  return {
    demandas,
    filteredDemandas,
    isLoading,
    searchTerm,
    setSearchTerm,
    setDemandas,  // Expose this for useDemandasData
  };
};
