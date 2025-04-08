
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Demand } from './types';

export const useDemandasData = () => {
  const [demandas, setDemandas] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
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
              descricao
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
            perguntas,
            servico_id,
            servico:servicos (
              descricao
            ),
            arquivo_url,
            anexos,
            protocolo
          `)
          .order('horario_publicacao', { ascending: false })
          .limit(50);

        if (error) {
          throw error;
        }

        // Fetch notas for each demanda
        const demandasWithNotas = await Promise.all(
          data.map(async (demanda) => {
            const { data: notas, error: notasError } = await supabase
              .from('notas_oficiais')
              .select('id, demanda_id, titulo, autor_id')
              .eq('demanda_id', demanda.id);

            if (notasError) {
              console.error('Error fetching notas for demanda:', notasError);
              return {
                ...demanda,
                horario_publicacao: demanda.horario_publicacao || '',
                area_coordenacao: null, // Add the required property with a default value
                supervisao_tecnica: null, // Add other required properties
                notas: []
              } as Demand;
            }

            return {
              ...demanda,
              horario_publicacao: demanda.horario_publicacao || '',
              area_coordenacao: null, // Add the required property with a default value
              supervisao_tecnica: null, // Add other required properties
              notas: notas || []
            } as Demand;
          })
        );

        setDemandas(demandasWithNotas);
      } catch (err: any) {
        console.error('Error fetching demandas:', err);
        setError('Erro ao buscar demandas');
      } finally {
        setLoading(false);
      }
    };

    fetchDemandas();
  }, []);

  const getPendingDemandas = () => {
    return demandas.filter(
      (demanda) =>
        demanda.status === 'pendente' || demanda.status === 'em_andamento'
    );
  };

  const getDemandaById = (id: string) => {
    return demandas.find((demanda) => demanda.id === id);
  };

  return {
    demandas,
    loading,
    error,
    getPendingDemandas,
    getDemandaById
  };
};

export default useDemandasData;
