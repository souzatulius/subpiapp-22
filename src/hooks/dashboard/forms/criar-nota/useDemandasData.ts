
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
            prioridade,
            detalhes_solicitacao,
            resumo_situacao,
            perguntas,
            horario_publicacao,
            prazo_resposta,
            endereco,
            veiculo_imprensa,
            arquivo_url,
            anexos,
            problema_id,
            problema:problema_id (
              id, 
              descricao,
              coordenacao_id,
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
            bairro_id,
            bairros:bairro_id (
              id, 
              nome,
              distritos:distrito_id (
                id, 
                nome
              )
            ),
            autor_id,
            autor:autor_id (
              id,
              nome_completo
            )
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
        
        // Fetch responses for all demandas to get comentarios
        const { data: respostasData, error: respostasError } = await supabase
          .from('respostas_demandas')
          .select('demanda_id, comentarios, respostas, texto');
        
        if (respostasError) {
          console.error('Error fetching respostas:', respostasError);
        }
        
        // Create a map of demanda_id to resposta data
        const respostasMap = new Map();
        if (respostasData) {
          respostasData.forEach(resposta => {
            respostasMap.set(resposta.demanda_id, resposta);
          });
        }
        
        // Process each demanda to ensure it has all necessary fields
        const processedDemandas = allDemandas
          // Filter to only include demandas without notas
          .filter(demanda => !demandasComNotas.has(demanda.id))
          // Map to ensure all required fields are present
          .map(demanda => {
            // Get resposta data if available
            const resposta = respostasMap.get(demanda.id);
            
            // Parse JSON resposta data if needed
            let respostasObj = null;
            if (resposta && resposta.respostas) {
              if (typeof resposta.respostas === 'string') {
                try {
                  respostasObj = JSON.parse(resposta.respostas);
                } catch (e) {
                  console.error('Error parsing respostas:', e);
                }
              } else {
                respostasObj = resposta.respostas;
              }
            }
            
            // Create a processed demanda with all required fields and proper defaults
            const processedDemanda: Demand = {
              id: demanda.id,
              titulo: demanda.titulo || '',
              status: demanda.status || 'pendente',
              prioridade: demanda.prioridade || 'media',
              detalhes_solicitacao: demanda.detalhes_solicitacao || '',
              resumo_situacao: demanda.resumo_situacao || '',
              perguntas: demanda.perguntas || null,
              horario_publicacao: demanda.horario_publicacao || null,
              prazo_resposta: demanda.prazo_resposta || null,
              endereco: demanda.endereco || '',
              veiculo_imprensa: demanda.veiculo_imprensa || '',
              arquivo_url: demanda.arquivo_url || null,
              anexos: demanda.anexos || null,
              problema_id: demanda.problema_id || null,
              problema: demanda.problema ? {
                id: demanda.problema.id,
                descricao: demanda.problema.descricao || '',
                coordenacao: demanda.problema.coordenacao ? {
                  id: demanda.problema.coordenacao.id,
                  descricao: demanda.problema.coordenacao.descricao || '',
                  sigla: demanda.problema.coordenacao.sigla || ''
                } : null
              } : { descricao: null },
              coordenacao_id: demanda.coordenacao_id || null,
              coordenacao: demanda.coordenacao ? {
                id: demanda.coordenacao.id,
                descricao: demanda.coordenacao.descricao || '',
                sigla: demanda.coordenacao.sigla || ''
              } : null,
              servico_id: demanda.servico_id || null,
              servico: demanda.servico ? {
                id: demanda.servico.id,
                descricao: demanda.servico.descricao || ''
              } : null,
              bairro_id: demanda.bairro_id || null,
              bairros: demanda.bairros ? {
                id: demanda.bairros.id,
                nome: demanda.bairros.nome || '',
                distritos: demanda.bairros.distritos ? {
                  id: demanda.bairros.distritos.id,
                  nome: demanda.bairros.distritos.nome || ''
                } : null
              } : null,
              autor_id: demanda.autor_id || null,
              autor: demanda.autor ? {
                id: demanda.autor.id,
                nome_completo: demanda.autor.nome_completo || 'Usuário'
              } : null,
              // Add comentarios from resposta if available
              comentarios: resposta ? resposta.comentarios : null,
              // Add the resposta data directly
              resposta: resposta ? {
                respostas: respostasObj,
                texto: resposta.texto
              } : null
            };
            
            return processedDemanda;
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
      demanda.coordenacao?.sigla?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.resumo_situacao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.detalhes_solicitacao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.servico?.descricao?.toLowerCase().includes(lowercaseSearchTerm) ||
      demanda.bairros?.nome?.toLowerCase().includes(lowercaseSearchTerm)
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
