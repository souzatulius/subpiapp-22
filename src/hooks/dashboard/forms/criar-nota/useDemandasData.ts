import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demand } from './types';

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
        
        // Check if resumo_situacao column exists
        const { error: testError } = await supabase
          .from('demandas')
          .select('resumo_situacao')
          .limit(1);
          
        const hasResumoSituacao = !testError;
        
        // Primeiro buscamos as demandas que estão pendentes ou em andamento
        const baseQuery = `
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
        `;
        
        // Add resumo_situacao if it exists
        const finalQuery = hasResumoSituacao ? `resumo_situacao, ${baseQuery}` : baseQuery;
        
        const { data: allDemandas, error: demandasError } = await supabase
          .from('demandas')
          .select(finalQuery)
          .in('status', ['pendente', 'em_andamento', 'respondida'])
          .order('horario_publicacao', { ascending: false });
        
        if (demandasError) {
          console.error('Erro ao buscar demandas:', demandasError);
          return;
        }
        
        // Buscar todas as notas oficiais para verificar quais demandas já possuem notas
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('demanda_id');
        
        if (notasError) {
          console.error('Erro ao buscar notas:', notasError);
          return;
        }
        
        // Criar um conjunto de IDs de demandas que já possuem notas
        const demandasComNotas = new Set(notasData?.map(nota => nota.demanda_id).filter(Boolean) || []);
        
        // Filtrar para incluir apenas demandas que não possuem notas associadas
        const demandasSemNotas = allDemandas ? allDemandas.filter(demanda => !demandasComNotas.has(demanda.id)) : [];
        
        console.log('All demandas:', allDemandas ? allDemandas.length : 0);
        console.log('Demandas with notas:', demandasComNotas.size);
        console.log('Demandas without notas:', demandasSemNotas.length);
        
        // Buscar informações do problema para cada demanda
        const demandasProcessadas = await Promise.all(
          demandasSemNotas.map(async (demanda) => {
            try {
              // Usando cast explícito para evitar tipos complexos
              const demandaItem = demanda as any;
              
              if (demandaItem.problema_id) {
                const { data: problemaData } = await supabase
                  .from('problemas')
                  .select('id, descricao, coordenacao_id')
                  .eq('id', demandaItem.problema_id)
                  .single();
                
                // Criar objeto completo da demanda com todas as propriedades necessárias
                const demandaCompleta: Demand = {
                  id: demandaItem.id || '',
                  titulo: demandaItem.titulo || '',
                  status: demandaItem.status || '',
                  detalhes_solicitacao: demandaItem.detalhes_solicitacao || null,
                  perguntas: demandaItem.perguntas || null,
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
                  problema: { descricao: problemaData?.descricao || null },
                  resumo_situacao: hasResumoSituacao ? demandaItem.resumo_situacao : null,
                  arquivo_url: demandaItem.arquivo_url || null,
                  anexos: demandaItem.anexos || null
                };
                
                return demandaCompleta;
              }
              
              // Se não tiver problema, criar objeto com valores padrão
              const demandaSimples: Demand = {
                id: demandaItem.id || '',
                titulo: demandaItem.titulo || '',
                status: demandaItem.status || '',
                detalhes_solicitacao: demandaItem.detalhes_solicitacao || null,
                perguntas: demandaItem.perguntas || null,
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
                problema: { descricao: null },
                resumo_situacao: hasResumoSituacao ? demandaItem.resumo_situacao : null,
                arquivo_url: demandaItem.arquivo_url || null,
                anexos: demandaItem.anexos || null
              };
              
              return demandaSimples;
            } catch (error) {
              console.error('Error processing demand:', error);
              // Return a minimal valid demand object
              const demandaItem = demanda as any;
              return {
                id: demandaItem.id || '',
                titulo: demandaItem.titulo || '',
                status: demandaItem.status || '',
                area_coordenacao: null,
                problema: { descricao: null },
                detalhes_solicitacao: demandaItem.detalhes_solicitacao || null
              } as Demand;
            }
          })
        );
        
        setDemandas(demandasProcessadas);
        setFilteredDemandas(demandasProcessadas);
      } catch (error) {
        console.error('Erro ao carregar demandas:', error);
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
      (demanda.area_coordenacao?.descricao?.toLowerCase() || '').includes(lowercaseSearchTerm)
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
