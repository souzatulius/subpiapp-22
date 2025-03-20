
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NotaOficial } from '@/components/consultar-notas/NotasTable';

export const useNotasData = () => {
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchNotas = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            *,
            autor:autor_id(nome_completo),
            areas_coordenacao:area_coordenacao_id(nome)
          `)
          .order('criado_em', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match the NotaOficial interface
          const transformedData: NotaOficial[] = data.map(item => ({
            id: item.id,
            titulo: item.titulo,
            texto: item.texto,
            status: item.status,
            criado_em: item.criado_em,
            atualizado_em: item.atualizado_em,
            autor: {
              nome_completo: item.autor?.nome_completo || 'Não informado'
            },
            areas_coordenacao: {
              nome: item.areas_coordenacao?.nome || 'Não informada'
            }
          }));
          
          setNotas(transformedData);
        }
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotas();
  }, []);

  // Apply filters
  const filteredNotas = notas.filter(nota => {
    // Filter by search query (title or text)
    const matchesSearch = searchQuery === '' || 
      nota.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nota.texto.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === '' || nota.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return {
    notas: filteredNotas,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    formatDate
  };
};
