
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/components/dashboard/forms/criar-nota/types';

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
        
        // Fetch demandas that are in 'pendente', 'em_andamento', or 'respondida' status
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
            problema:problema_id (
              id, 
              descricao,
              coordenacao:coordenacao_id (
                id, 
                descricao,
                sigla
              )
            ),
            coordenacao_id,
            coordenacao:coordenacao_id (
              id, 
              descricao,
              sigla
            ),
            servico_id,
            servico:servico_id (
              id, 
              descricao
            ),
            arquivo_url,
            anexos,
            protocolo,
            horario_publicacao,
            prazo_resposta,
            prioridade,
            origem_id,
            origens_demandas:origem_id (
              id, 
              descricao
            ),
            tipo_midia_id,
            tipo_midia:tipo_midia_id (
              id, 
              descricao
            ),
            bairro_id,
            bairros:bairro_id (
              id, 
              nome,
              distrito:distrito_id (
                id, 
                nome
              )
            ),
            nome_solicitante,
            email_solicitante,
            telefone_solicitante,
            veiculo_imprensa,
            endereco
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
        
        // Fetch existing notas
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id')
          .not('demanda_id', 'is', null);
        
        if (notasError) {
          console.error('Error fetching notas:', notasError);
          throw notasError;
        }
        
        // Create a set of demanda IDs that already have notas
        const demandasComNotas = new Set(
          notasData?.map(nota => nota.demanda_id) || []
        );
        
        console.log('All demandas:', allDemandas.length);
        console.log('Demandas with notas:', demandasComNotas.size);
        
        // Process each demanda to ensure it has all necessary fields
        const processedDemandas = allDemandas
          // Filter to only include demandas without notas
          .filter(demanda => !demandasComNotas.has(demanda.id))
          // Map to ensure all required fields are present
          .map(demanda => {
            const processedDemanda = {
              ...demanda,
              // Ensure proper structure for all fields
              problema: demanda.problema || { descricao: null },
              coordenacao: demanda.coordenacao || { descricao: null, sigla: null },
              servico: demanda.servico || { descricao: null },
              bairros: demanda.bairros || { nome: null },
              origens_demandas: demanda.origens_demandas || { descricao: null },
              tipo_midia: demanda.tipo_midia || { descricao: null },
              horario_publicacao: demanda.horario_publicacao || null,
              prazo_resposta: demanda.prazo_resposta || null,
              prioridade: demanda.prioridade || 'media',
              arquivo_url: demanda.arquivo_url || null,
              anexos: demanda.anexos || null
            };
            
            return processedDemanda as unknown as Demand;
          });
        
        console.log('Processed demandas ready for notes:', processedDemandas.length);
        if (processedDemandas.length > 0) {
          console.log('Sample processed demanda:', processedDemandas[0]);
        }
        
        setDemandas(processedDemandas);
        setFilteredDemandas(processedDemandas);
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

  // Filter demandas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDemandas(demandas);
      return;
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = demandas.filter(demanda => 
      demanda.titulo?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.problema?.descricao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.coordenacao?.descricao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.resumo_situacao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.detalhes_solicitacao?.toLowerCase().includes(lowercaseSearchTerm)
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
