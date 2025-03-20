
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { OrdemServico } from '../types';

/**
 * Hook for handling Excel file parsing and uploads
 */
export const useFileUpload = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * Parse an Excel file into JSON data
   */
  const parseExcel = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Extract headers from the first row
        const headers = jsonData[0] as string[];

        // Extract data starting from the second row
        const dataRows = jsonData.slice(1) as any[][];

        // Transform the data into an array of objects
        const transformedData = dataRows.map(row => {
          const rowObject: any = {};
          headers.forEach((header, index) => {
            rowObject[header] = row[index];
          });
          return rowObject;
        });

        resolve(transformedData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Upload an Excel file and process its data
   */
  const uploadExcel = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const parsedData = await parseExcel(file);
      if (!parsedData || parsedData.length === 0) {
        toast({
          title: "Erro ao processar o arquivo!",
          description: "O arquivo está vazio ou em formato incorreto.",
          variant: "destructive",
        });
        return;
      }

      // Function to check if a record already exists
      const recordExists = async (ordemServico: string): Promise<boolean> => {
        const { data, error } = await supabase
          .from('ordens_servico')
          .select('id')
          .eq('ordem_servico', ordemServico)
          .single();

        if (error) {
          console.error('Erro ao verificar se a ordem existe:', error);
          return false;
        }

        return !!data;
      };

      let insertedCount = 0;
      let updatedCount = 0;

      for (const record of parsedData) {
        // Check if 'ordem_servico' property exists in the record
        if (!record.hasOwnProperty('ordem_servico')) {
          console.warn('Skipping record due to missing "ordem_servico" property:', record);
          continue; // Skip to the next record
        }

        const ordemServico = record.ordem_servico;

        // Check if the record already exists
        const exists = await recordExists(ordemServico);

        if (exists) {
          // Update the existing record
          const { error } = await supabase
            .from('ordens_servico')
            .update(record)
            .eq('ordem_servico', ordemServico);

          if (error) {
            console.error('Erro ao atualizar ordem de serviço:', error);
          } else {
            updatedCount++;
          }
        } else {
          // Insert the new record
          const { error } = await supabase
            .from('ordens_servico')
            .insert([record]);

          if (error) {
            console.error('Erro ao inserir ordem de serviço:', error);
          } else {
            insertedCount++;
          }
        }
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Log the upload
      const uploadLog = {
        usuario_id: user ? user.id : null,
        nome_arquivo: file.name,
        registros_inseridos: insertedCount,
        registros_atualizados: updatedCount,
        data_upload: new Date().toISOString(),
      };

      // Use uploads_ordens_servico table which exists in the schema
      const { error: logError } = await supabase
        .from('uploads_ordens_servico')
        .insert([uploadLog]);

      if (logError) {
        console.error('Erro ao inserir log de upload:', logError);
        toast({
          title: "Erro ao inserir log de upload!",
          description: "Ocorreu um problema ao salvar o log de upload.",
          variant: "destructive",
        });
      }

      toast({
        title: "Sucesso!",
        description: `Arquivo ${file.name} processado. Inseridos: ${insertedCount}, Atualizados: ${updatedCount}.`,
      });

      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro durante o upload:', error);
      toast({
        title: "Erro durante o upload!",
        description: error.message || "Ocorreu um erro inesperado durante o upload.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, onSuccess]);

  /**
   * Upload a general file to storage
   */
  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = fileName;

      const { data, error } = await supabase
        .storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        toast({
          title: "Erro ao fazer upload do arquivo!",
          description: "Ocorreu um problema ao enviar o arquivo.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const { data: publicUrlData } = supabase
          .storage
          .from('uploads')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          toast({
            title: "Sucesso!",
            description: `Arquivo ${file.name} enviado com sucesso!`,
          });
        }
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast({
        title: "Erro ao fazer upload do arquivo!",
        description: "Ocorreu um problema ao enviar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Download a file from storage
   */
  const downloadExcel = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .storage
        .from('excel')
        .createSignedUrl('modelo_ordens_servico.xlsx', 60);

      if (error) {
        console.error('Erro ao gerar URL assinada:', error);
        toast({
          title: "Erro ao gerar URL assinada!",
          description: "Ocorreu um problema ao gerar o link para download.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        // Trigger the download using the signed URL
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = 'modelo_ordens_servico.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro ao fazer download do Excel:', error);
      toast({
        title: "Erro ao fazer download do Excel!",
        description: "Ocorreu um problema ao baixar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Download an uploaded file using its public URL
   */
  const downloadUploadedFile = useCallback(async (publicUrl: string, filename: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .createSignedUrl(publicUrl, 60);

      if (error) {
        console.error('Erro ao gerar URL assinada:', error);
        toast({
          title: "Erro ao gerar URL assinada!",
          description: "Ocorreu um problema ao gerar o link para download.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro ao fazer download do arquivo:', error);
      toast({
        title: "Erro ao fazer download do arquivo!",
        description: "Ocorreu um problema ao baixar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    uploadExcel,
    uploadFile,
    downloadExcel,
    downloadUploadedFile
  };
};
