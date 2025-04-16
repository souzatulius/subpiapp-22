
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demand } from '@/components/dashboard/forms/criar-nota/types';
import { toast } from '@/components/ui/use-toast';

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        // First, get all demandas with 'respondida' status
        const { data: demandasData, error: demandasError } = await supabase
          .from('demandas')
          .select(`
            id,
            titulo,
            status,
            prioridade,
            horario_publicacao,
            prazo_resposta,
            coordenacao_id,
            problema_id,
            problema:problemas (
              id,
              descricao,
              coordenacao:coordenacao_id (id, descricao)
            ),
            origem_id,
            origem:origens_demandas (
              descricao
            ),
            tipo_midia_id,
            tipo_midia:tipos_midia (
              descricao
            ),
            bairro_id,
            bairro:bairros (
              nome,
              distritos (
                nome
              )
            ),
            autor:usuarios (
              nome_completo
            ),
            endereco,
            nome_solicitante,
            email_solicitante,
            telefone_solicitante,
            veiculo_imprensa,
            detalhes_solicitacao,
            resumo_situacao,
            perguntas,
            servico_id,
            servico:servicos (
              descricao
            ),
            arquivo_url,
            anexos,
            protocolo
          `)
          .in('status', ['respondida'])
          .order('horario_publicacao', { ascending: false });

        if (demandasError) {
          throw demandasError;
        }

        // Fetch respostas for each demanda
        const demandasWithRespostas = await Promise.all(
          (demandasData || []).map(async (demanda) => {
            // Fetch the response for this demand to get comments
            const { data: respostaData, error: respostaError } = await supabase
              .from('respostas_demandas')
              .select('texto, comentarios, respostas')
              .eq('demanda_id', demanda.id)
              .maybeSingle();

            if (respostaError) {
              console.error('Error fetching resposta for demanda:', respostaError);
            }

            // Fetch notas for this demand
            const { data: notas, error: notasError } = await supabase
              .from('notas_oficiais')
              .select('id, demanda_id, titulo, autor_id')
              .eq('demanda_id', demanda.id);

            if (notasError) {
              console.error('Error fetching notas for demanda:', notasError);
            }

            // Convert bairro and distrito data into the expected format
            const bairroData = demanda.bairro;
            const distritoData = bairroData && bairroData.distritos ? bairroData.distritos : null;

            return {
              ...demanda,
              comentarios: respostaData?.comentarios || null,
              resposta_texto: respostaData?.texto || null,
              respostas: respostaData?.respostas || null,
              notas: notas || [],
              horario_publicacao: demanda.horario_publicacao || '',
              distrito: distritoData,
              origens_demandas: demanda.origem
            } as unknown as Demand;
          })
        );

        setDemandas(demandasWithRespostas);
      } catch (err: any) {
        console.error('Error fetching demandas:', err);
        setError(err.message || 'Erro ao buscar demandas');
        toast({
          title: "Erro",
          description: "Falha ao carregar as demandas. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandas();
  }, []);

  // Filter demandas based on search term
  const filteredDemandas = demandas.filter(demanda => {
    if (!searchTerm) return true;
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    
    return (
      (demanda.titulo && demanda.titulo.toLowerCase().includes(lowercaseSearchTerm)) ||
      (demanda.veiculo_imprensa && demanda.veiculo_imprensa.toLowerCase().includes(lowercaseSearchTerm)) ||
      (demanda.problema?.descricao && demanda.problema.descricao.toLowerCase().includes(lowercaseSearchTerm)) ||
      (demanda.area_coordenacao?.descricao && demanda.area_coordenacao.descricao.toLowerCase().includes(lowercaseSearchTerm))
    );
  });

  return {
    demandas,
    filteredDemandas,
    searchTerm,
    setSearchTerm,
    isLoading,
    error
  };
};
