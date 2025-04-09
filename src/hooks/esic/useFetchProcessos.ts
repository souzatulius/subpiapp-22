
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ESICProcesso } from '@/types/esic';

interface FetchOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  coordenacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const useFetchProcessos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [total, setTotal] = useState(0);

  const fetchProcessos = async (options: FetchOptions = {}): Promise<ESICProcesso[]> => {
    setLoading(true);
    setError(null);

    try {
      // Build the query
      let query = supabase
        .from('esic_processos')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (options.searchTerm) {
        query = query.or(`assunto.ilike.%${options.searchTerm}%,protocolo.ilike.%${options.searchTerm}%,solicitante.ilike.%${options.searchTerm}%,texto.ilike.%${options.searchTerm}%`);
      }
      
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      if (options.coordenacao) {
        query = query.eq('coordenacao_id', options.coordenacao);
      }
      
      if (options.dataInicio) {
        query = query.gte('data_processo', options.dataInicio);
      }
      
      if (options.dataFim) {
        query = query.lte('data_processo', options.dataFim);
      }
      
      // Apply pagination
      if (options.page && options.pageSize) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      }
      
      // Apply ordering
      query = query.order('criado_em', { ascending: false });
      
      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Transform the data
        const processedData = data.map((p: any) => {
          // Ensure status is one of the valid types
          let status: ESICProcesso['status'] = 'novo_processo';
          if (p.status === 'aberto' || 
              p.status === 'em_andamento' ||
              p.status === 'concluido' ||
              p.status === 'cancelado' ||
              p.status === 'aguardando_justificativa' ||
              p.status === 'aguardando_aprovacao' ||
              p.status === 'novo_processo') {
            status = p.status as ESICProcesso['status'];
          }
          
          return {
            id: p.id,
            protocolo: p.protocolo,
            assunto: p.assunto,
            solicitante: p.solicitante,
            data_processo: p.data_processo,
            criado_em: p.criado_em,
            created_at: p.criado_em,
            atualizado_em: p.atualizado_em,
            autor_id: p.autor_id,
            texto: p.texto,
            situacao: p.situacao,
            status: status,
            autor: undefined,
            coordenacao_id: p.coordenacao_id,
            prazo_resposta: p.prazo_resposta,
            coordenacao: { nome: p.coordenacao }
          } as ESICProcesso;
        });
        
        setProcessos(processedData);
        setTotal(count || 0);
        return processedData;
      } else {
        setProcessos([]);
        setTotal(0);
        return [];
      }
    } catch (err: any) {
      console.error('Error fetching processos:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProcessos,
    processos,
    loading,
    error,
    total
  };
};
