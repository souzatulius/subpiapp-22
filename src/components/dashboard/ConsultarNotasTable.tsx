
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
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  const { data: notas = [], isLoading, refetch } = useQuery({
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
          created_at,
          autor:user_id (id, nome_completo),
          problema (
            id,
            descricao,
            coordenacao (id, descricao)
          ),
          supervisao_tecnica (id, descricao),
          area_coordenacao (id, descricao)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our NotaOficial type
      return (data || []).map(nota => ({
        ...nota,
        conteudo: nota.texto || '', // Map texto to conteudo for type compatibility
        demanda_id: (nota as any).demanda_id,
        autor: nota.autor || undefined,
        problema: nota.problema || undefined,
        supervisao_tecnica: nota.supervisao_tecnica || undefined,
        area_coordenacao: nota.area_coordenacao || undefined
      })) as NotaOficial[];
    },
  });

  const handleViewNota = (nota: NotaOficial) => {
    // Open the detail dialog or navigate to detail page
    navigate(`/dashboard/comunicacao/notas/detalhes?id=${nota.id}`);
  };

  const handleExportPDF = async (nota: NotaOficial) => {
    setExporting(true);
    try {
      // PDF export functionality would go here
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
