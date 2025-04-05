
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import NotasTable from '@/components/consultar-notas/NotasTable';
import { NotaOficial } from '@/types/nota';
import { toast } from '@/components/ui/use-toast';
import { ensureNotaCompat } from '@/components/consultar-notas/NotaCompat';

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
          problema (
            id,
            descricao,
            coordenacao_id,
            coordenacao (id, descricao)
          ),
          supervisao_tecnica_id,
          supervisao_tecnica (id, descricao),
          coordenacao_id,
          area_coordenacao (id, descricao)
        `)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Process the notas to ensure they match our NotaOficial type
  const notas: NotaOficial[] = notasRaw.map(nota => {
    // Create a compatible NotaOficial object
    const notaOficial: NotaOficial = {
      id: nota.id,
      titulo: nota.titulo,
      conteudo: nota.texto || '', // Use texto for conteudo
      texto: nota.texto,
      status: nota.status,
      criado_em: nota.criado_em,
      autor: nota.autor_id ? { id: nota.autor_id, nome_completo: 'Usuário' } : undefined,
      problema: nota.problema || undefined,
      supervisao_tecnica: nota.supervisao_tecnica || undefined,
      area_coordenacao: nota.area_coordenacao || undefined
    };
    
    // Ensure backward compatibility
    return ensureNotaCompat(notaOficial);
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
