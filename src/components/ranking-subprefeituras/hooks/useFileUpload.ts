
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import * as XLSX from 'xlsx';

/**
 * Hook for handling file upload and download functionality
 */
export const useFileUpload = (onSuccess: (inserted: number, updated: number) => void) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Upload Excel file and process it
  const uploadExcel = useCallback(async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "É necessário estar autenticado para enviar arquivos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create FormData to upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      // Call the edge function to process the Excel file
      const { data, error } = await supabase.functions.invoke('process-xls-upload', {
        body: formData,
      });

      if (error) {
        throw new Error(`Erro ao processar arquivo: ${error.message}`);
      }

      if (data.error) {
        throw new Error(`Erro no processamento: ${data.error}`);
      }

      // Ensure these are numbers, not undefined
      const inserted = data.inseridos || 0;
      const updated = data.atualizados || 0;

      toast({
        title: "Upload concluído com sucesso!",
        description: `${inserted} registros inseridos e ${updated} registros atualizados.`,
      });

      // Call success callback to refresh data
      onSuccess(inserted, updated);
      
      return { inserted, updated };
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um problema ao processar o arquivo.",
        variant: "destructive",
      });
      return { inserted: 0, updated: 0 };
    } finally {
      setLoading(false);
    }
  }, [user, toast, onSuccess]);

  // Download Excel template
  const downloadExcel = useCallback(() => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Define the headers for the template
      const headers = [
        'ordem_servico', 
        'classificacao', 
        'criado_em', 
        'status', 
        'dias', 
        'bairro', 
        'distrito'
      ];
      
      // Create a worksheet with just the headers
      const ws = XLSX.utils.aoa_to_sheet([headers]);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'OrdemServico');
      
      // Generate the Excel file and trigger download
      XLSX.writeFile(wb, 'modelo_ordens_servico.xlsx');
      
      toast({
        title: "Download concluído",
        description: "Modelo de planilha baixado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao gerar modelo:', error);
      toast({
        title: "Erro ao gerar modelo",
        description: "Não foi possível gerar o modelo de planilha.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    loading,
    uploadExcel,
    downloadExcel
  };
};
