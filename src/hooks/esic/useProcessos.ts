import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Processo {
  id: string;
  assunto: string;
  numero_sei: string;
  data_cadastro: string;
  prazo: string;
  autor: {
    nome: string;
    sobrenome: string;
  };
  coordenacao: {
    nome: string;
  };
  status: string;
}

interface FilterOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  coordenacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

const formatAutorName = (item: any) => {
  return item.autor ? `${item.autor.nome} ${item.autor.sobrenome}` : 'Usuário anônimo';
};

export const useProcessos = () => {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    status: '',
    coordenacao: '',
    dataInicio: '',
    dataFim: '',
  });

  const fetchProcessos = async (options: FilterOptions = {}) => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('processos')
      .select(`
        id,
        assunto,
        numero_sei,
        data_cadastro,
        prazo,
        autor:usuarios ( nome, sobrenome ),
        coordenacao:coordenacoes ( nome ),
        status,
        total:count
      `, { count: 'exact' })
      .order('data_cadastro', { ascending: false });

    if (options.searchTerm) {
      query = query.ilike('assunto', `%${options.searchTerm}%`);
    }

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.coordenacao) {
      query = query.eq('coordenacao_id', options.coordenacao);
    }

    if (options.dataInicio && options.dataFim) {
      query = query.gte('data_cadastro', options.dataInicio);
      query = query.lte('data_cadastro', options.dataFim);
    }

    const page = options.page || filterOptions.page || 1;
    const pageSize = options.pageSize || filterOptions.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;

    query = query.range(startIndex, endIndex);

    try {
      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const formattedProcessos = data.map(item => ({
          id: item.id,
          assunto: item.assunto,
          numero_sei: item.numero_sei,
          data_cadastro: item.data_cadastro,
          prazo: item.prazo,
          autor: {
            nome: item.autor ? item.autor.nome : 'Usuário',
            sobrenome: item.autor ? item.autor.sobrenome : 'Anônimo'
          },
          coordenacao: {
            nome: item.coordenacao ? item.coordenacao.nome : 'Desconhecida'
          },
          status: item.status
        }));
        setProcessos(formattedProcessos);
        setTotal(count || 0);
      } else {
        setProcessos([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao buscar processos',
        description: 'Ocorreu um erro ao carregar os processos. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProcessoStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('processos')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setProcessos(prevProcessos =>
        prevProcessos.map(processo =>
          processo.id === id ? { ...processo, status: newStatus } : processo
        )
      );
      toast({
        title: 'Status do processo atualizado',
        description: 'O status do processo foi atualizado com sucesso.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status do processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProcesso = async (processoData: Omit<Processo, 'id' | 'autor'> & { autor_id: string, coordenacao_id: string }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('processos')
        .insert([
          {
            assunto: processoData.assunto,
            numero_sei: processoData.numero_sei,
            data_cadastro: processoData.data_cadastro,
            prazo: processoData.prazo,
            autor_id: processoData.autor_id,
            coordenacao_id: processoData.coordenacao_id,
            status: processoData.status,
          },
        ])
        .select(`
          id,
          assunto,
          numero_sei,
          data_cadastro,
          prazo,
          autor:usuarios ( nome, sobrenome ),
          coordenacao:coordenacoes ( nome ),
          status
        `);

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        const newProcesso = data[0];
        setProcessos(prevProcessos => [
          ...prevProcessos,
          {
            id: newProcesso.id,
            assunto: newProcesso.assunto,
            numero_sei: newProcesso.numero_sei,
            data_cadastro: newProcesso.data_cadastro,
            prazo: newProcesso.prazo,
            autor: {
              nome: newProcesso.autor ? newProcesso.autor.nome : 'Usuário',
              sobrenome: newProcesso.autor ? newProcesso.autor.sobrenome : 'Anônimo'
            },
            coordenacao: {
              nome: newProcesso.coordenacao ? newProcesso.coordenacao.nome : 'Desconhecida'
            },
            status: newProcesso.status
          }
        ]);
        toast({
          title: 'Processo criado com sucesso',
          description: 'O processo foi criado e adicionado à lista.',
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao criar processo',
        description: 'Ocorreu um erro ao criar o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProcesso = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('processos')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setProcessos(prevProcessos => prevProcessos.filter(processo => processo.id !== id));
      toast({
        title: 'Processo excluído com sucesso',
        description: 'O processo foi removido da lista.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao excluir processo',
        description: 'Ocorreu um erro ao excluir o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getProcessoById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('processos')
        .select(`
          id,
          assunto,
          numero_sei,
          data_cadastro,
          prazo,
          autor:usuarios ( nome, sobrenome ),
          coordenacao:coordenacoes ( nome ),
          status
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        return {
          id: data.id,
          assunto: data.assunto,
          numero_sei: data.numero_sei,
          data_cadastro: data.data_cadastro,
          prazo: data.prazo,
          autor: {
            nome: data.autor ? data.autor.nome : 'Usuário',
            sobrenome: data.autor ? data.autor.sobrenome : 'Anônimo'
          },
          coordenacao: {
            nome: data.coordenacao ? data.coordenacao.nome : 'Desconhecida'
          },
          status: data.status
        };
      } else {
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao buscar processo',
        description: 'Ocorreu um erro ao buscar o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProcesso = async (id: string, updates: Partial<Processo> & { coordenacao_id: string }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('processos')
        .update({
          assunto: updates.assunto,
          numero_sei: updates.numero_sei,
          data_cadastro: updates.data_cadastro,
          prazo: updates.prazo,
          coordenacao_id: updates.coordenacao_id,
          status: updates.status,
        })
        .eq('id', id)
        .select(`
          id,
          assunto,
          numero_sei,
          data_cadastro,
          prazo,
          autor:usuarios ( nome, sobrenome ),
          coordenacao:coordenacoes ( nome ),
          status
        `);

      if (error) {
        throw new Error(error.message);
      }

     if (data && data.length > 0) {
        const updatedProcesso = data[0];
        setProcessos(prevProcessos =>
          prevProcessos.map(processo =>
            processo.id === id
              ? {
                  id: updatedProcesso.id,
                  assunto: updatedProcesso.assunto,
                  numero_sei: updatedProcesso.numero_sei,
                  data_cadastro: updatedProcesso.data_cadastro,
                  prazo: updatedProcesso.prazo,
                  autor: {
                    nome: updatedProcesso.autor ? updatedProcesso.autor.nome : 'Usuário',
                    sobrenome: updatedProcesso.autor ? updatedProcesso.autor.sobrenome : 'Anônimo'
                  },
                  coordenacao: {
                    nome: updatedProcesso.coordenacao ? updatedProcesso.coordenacao.nome : 'Desconhecida'
                  },
                  status: updatedProcesso.status
                }
              : processo
          )
        );
        toast({
          title: 'Processo atualizado com sucesso',
          description: 'O processo foi atualizado com sucesso.',
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao atualizar processo',
        description: 'Ocorreu um erro ao atualizar o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    processos,
    loading,
    error,
    total,
    filterOptions,
    setFilterOptions,
    fetchProcessos,
    updateProcessoStatus,
    createProcesso,
    deleteProcesso,
    getProcessoById,
    updateProcesso,
  };
};
