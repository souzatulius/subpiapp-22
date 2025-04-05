
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import NotasTable from '@/components/consultar-notas/NotasTable';
import { NotaOficial } from '@/types/nota';

const ConsultarNotasTable = () => {
  const navigate = useNavigate();

  const { data: notasRaw = [], isLoading } = useQuery({
    queryKey: ['notas-oficiais'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            id,
            titulo,
            texto,
            status,
            criado_em,
            autor_id,
            autor:autor_id (id, nome_completo),
            aprovador_id,
            aprovador:aprovador_id (id, nome_completo),
            problema_id,
            problema:problema_id (
              id, 
              descricao,
              coordenacao_id,
              coordenacao:coordenacao_id (id, descricao)
            ),
            supervisao_tecnica_id,
            coordenacao_id
          `)
          .order('criado_em', { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching notas:", error);
        return [];
      }
    },
  });

  // Add safe transformation with fallbacks
  const notas: NotaOficial[] = (notasRaw || []).map((nota: any) => {
    // Create a safe author object
    const autor = nota?.autor ? {
      id: nota.autor.id || '',
      nome_completo: nota.autor.nome_completo || ''
    } : { id: '', nome_completo: '' };
    
    const aprovador = nota?.aprovador ? {
      id: nota.aprovador.id || '',
      nome_completo: nota.aprovador.nome_completo || ''
    } : null;
    
    // Create a safe problema object with coordenacao
    let problema = null;
    let area_coordenacao = null;
    
    if (nota?.problema) {
      problema = {
        id: nota.problema.id || '',
        descricao: nota.problema.descricao || '',
        coordenacao: nota.problema.coordenacao || null
      };
      
      // Extract area_coordenacao from problema if available
      if (nota.problema.coordenacao) {
        area_coordenacao = {
          id: nota.problema.coordenacao.id || '',
          descricao: nota.problema.coordenacao.descricao || ''
        };
      }
    }
    
    return {
      id: nota?.id || '',
      titulo: nota?.titulo || '',
      conteudo: nota?.texto || '', // Map texto to conteudo
      texto: nota?.texto || '',
      status: nota?.status || '',
      criado_em: nota?.criado_em || '',
      autor,
      aprovador,
      problema,
      area_coordenacao,
      supervisao_tecnica: null,
      demanda: null,
      demanda_id: null,
      problema_id: nota?.problema_id || null
    };
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const handleViewNota = (nota: NotaOficial) => {
    navigate(`/dashboard/comunicacao/notas/detalhe?id=${nota.id}`);
  };
  
  const handleEditNota = (id: string) => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${id}`);
  };

  return (
    <NotasTable 
      notas={notas}
      loading={isLoading}
      formatDate={formatDate}
      onViewNota={handleViewNota}
      onEditNota={handleEditNota}
    />
  );
};

export default ConsultarNotasTable;
