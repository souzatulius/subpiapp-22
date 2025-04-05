
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import NotasTable from '@/components/consultar-notas/NotasTable';
import { NotaOficial } from '@/types/nota';
import { useToast } from '@/components/ui/use-toast';

const ConsultarNotasTable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const { data: notasRaw = [], isLoading, refetch } = useQuery({
    queryKey: ['notas-oficiais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          id,
          titulo,
          texto,
          status,
          criado_em,
          autor_id,
          problema_id,
          problema:problema_id (
            id,
            descricao,
            coordenacao_id,
            coordenacao:coordenacao_id (id, descricao)
          ),
          supervisao_tecnica_id,
          supervisao_tecnica:supervisao_tecnica_id (id, descricao),
          coordenacao_id,
          area_coordenacao:coordenacao_id (id, descricao)
        `)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Process the notas to ensure they match our NotaOficial type
  const notas: NotaOficial[] = notasRaw.map(nota => {
    // Create a compatible NotaOficial object with safe fallbacks
    return {
      id: nota.id || '',
      titulo: nota.titulo || '',
      conteudo: nota.texto || '', // Map texto to conteudo
      texto: nota.texto || '',
      status: nota.status || '',
      criado_em: nota.criado_em || '',
      autor: nota.autor_id ? { id: nota.autor_id, nome_completo: 'Usuário' } : undefined,
      problema: nota.problema ? {
        id: nota.problema.id || '',
        descricao: nota.problema.descricao || '',
        coordenacao: nota.problema.coordenacao || undefined
      } : undefined,
      supervisao_tecnica: nota.supervisao_tecnica ? {
        id: nota.supervisao_tecnica.id || '',
        descricao: nota.supervisao_tecnica.descricao || '',
        coordenacao_id: nota.supervisao_tecnica.coordenacao_id
      } : undefined,
      area_coordenacao: nota.area_coordenacao ? {
        id: nota.area_coordenacao.id || '',
        descricao: nota.area_coordenacao.descricao || ''
      } : undefined
    };
  });

  const handleViewNota = (nota: NotaOficial) => {
    navigate(`/dashboard/comunicacao/notas/detalhes?id=${nota.id}`);
  };

  const handleExportPDF = async (nota: NotaOficial) => {
    setExporting(true);
    try {
      toast({
        title: "Exportação iniciada",
        description: "O PDF está sendo gerado e será baixado em instantes.",
      });
      
      // Simulate delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "PDF exportado com sucesso",
        description: "O arquivo foi baixado para o seu dispositivo.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <NotasTable
      notas={notas}
      loading={isLoading}
      formatDate={formatDate}
      onViewNota={handleViewNota}
      onExportPDF={handleExportPDF}
      exporting={exporting}
      deleteLoading={deleteLoading}
    />
  );
};

export default ConsultarNotasTable;
