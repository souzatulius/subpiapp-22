// Import any necessary modules
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { UploadResult } from '@/hooks/ranking/types/uploadTypes';
import { User } from '@supabase/supabase-js';

// Helper function to fetch the last upload
export const fetchLastUpload = async (user: User) => {
  // Default values
  const defaultResult = {
    lastUpload: null,
    uploads: []
  };
  
  if (!user) return defaultResult;
  
  try {
    const { data: uploads, error } = await supabase
      .from('sgz_uploads')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return {
      lastUpload: uploads?.[0] || null,
      uploads: uploads || []
    };
  } catch (err) {
    console.error('Error fetching last upload:', err);
    return defaultResult;
  }
};

// File upload handler for SGZ files
export const handleFileUpload = async (
  file: File, 
  user: User | null,
  progressCallback: (progress: number) => void,
  statsCallback: (stats: any) => void
): Promise<UploadResult | null> => {
  if (!user) {
    return {
      success: false,
      recordCount: 0,
      message: 'Usuário não autenticado'
    };
  }
  
  try {
    progressCallback(10);
    statsCallback({ processingStatus: 'processing', message: 'Processando arquivo...' });
    
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          progressCallback(20);
          statsCallback({ processingStatus: 'processing', message: 'Lendo dados...' });
          
          // Process Excel file
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (!jsonData || jsonData.length === 0) {
            reject({
              success: false,
              recordCount: 0,
              message: 'Arquivo vazio ou com formato inválido'
            });
            return;
          }
          
          progressCallback(30);
          statsCallback({ processingStatus: 'processing', message: 'Transformando dados...' });
          
          // Process and transform data
          const processedData = jsonData.map((row: any) => ({
            sgz_protocolo: row['Protocolo'] || row['SGZ'] || row['Protocolo SGZ'] || '',
            sgz_status: row['Status'] || '',
            sgz_area_tecnica: row['Área Técnica'] || row['Area Tecnica'] || '',
            sgz_coordenacao: row['Coordenação'] || row['Coordenacao'] || '',
            sgz_tipo_servico: row['Tipo de Serviço'] || row['Tipo Servico'] || row['Serviço'] || '',
            sgz_distrito: row['Distrito'] || '',
            sgz_data_abertura: row['Data de Abertura'] || row['Abertura'] || '',
            sgz_data_fechamento: row['Data de Fechamento'] || row['Fechamento'] || '',
            sgz_origem: row['Origem'] || row['Canal'] || '',
            sgz_criado_em: new Date().toISOString(),
            sgz_upload_id: null  // Will be set after upload record is created
          }));
          
          progressCallback(40);
          statsCallback({ 
            processingStatus: 'processing', 
            message: 'Salvando dados...',
            recordCount: processedData.length
          });
          
          // Create upload record
          const { data: uploadData, error: uploadError } = await supabase
            .from('sgz_uploads')
            .insert({
              usuario_email: user.email,
              nome_arquivo: file.name,
              registros: processedData.length
            })
            .select('id')
            .single();
          
          if (uploadError) throw uploadError;
          
          const uploadId = uploadData.id;
          
          // Now set the upload ID for all records
          const dataWithUploadId = processedData.map(item => ({
            ...item,
            sgz_upload_id: uploadId
          }));
          
          progressCallback(60);
          
          // Get total service orders count before inserting new data
          const { count: oldCount, error: countError } = await supabase
            .from('sgz_ordens_servico')
            .select('*', { count: 'exact', head: true });
            
          if (countError) throw countError;
          
          // Check for existing records to determine what's new vs. what's updated
          progressCallback(70);
          const existingProtocols = new Set();
          
          const { data: existingData, error: existingError } = await supabase
            .from('sgz_ordens_servico')
            .select('sgz_protocolo')
            .in('sgz_protocolo', dataWithUploadId.map(item => item.sgz_protocolo));
            
          if (existingError) throw existingError;
          
          existingData?.forEach(item => existingProtocols.add(item.sgz_protocolo));
          
          const newOrders = dataWithUploadId.filter(item => !existingProtocols.has(item.sgz_protocolo)).length;
          const updatedOrders = dataWithUploadId.filter(item => existingProtocols.has(item.sgz_protocolo)).length;
          
          statsCallback({ 
            processingStatus: 'processing', 
            newOrders,
            updatedOrders,
            totalServiceOrders: oldCount
          });
          
          progressCallback(80);
          
          // Insert data into database - upsert to update existing records
          const { error: insertError } = await supabase
            .from('sgz_ordens_servico')
            .upsert(dataWithUploadId, { 
              onConflict: 'sgz_protocolo',
              ignoreDuplicates: false
            });
          
          if (insertError) throw insertError;
          
          progressCallback(95);
          
          // Get new total count after insert
          const { count: newCount, error: newCountError } = await supabase
            .from('sgz_ordens_servico')
            .select('*', { count: 'exact', head: true });
            
          if (newCountError) throw newCountError;
          
          progressCallback(100);
          
          resolve({
            success: true,
            id: uploadId,
            recordCount: processedData.length,
            data: processedData,
            newOrders,
            updatedOrders, 
            totalServiceOrders: newCount,
            message: `${newOrders} registros novos, ${updatedOrders} registros atualizados`
          });
          
        } catch (error) {
          console.error('Error processing upload:', error);
          reject({
            success: false,
            recordCount: 0,
            message: 'Erro ao processar arquivo'
          });
        }
      };
      
      reader.onerror = () => {
        reject({
          success: false,
          recordCount: 0,
          message: 'Erro ao ler arquivo'
        });
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (err) {
    console.error('Upload error:', err);
    return {
      success: false,
      recordCount: 0,
      message: 'Erro ao processar upload'
    };
  }
};

// Painel Zeladoria upload handler
export const handlePainelZeladoriaUpload = async (
  file: File, 
  user: User | null,
  progressCallback: (progress: number) => void,
  statsCallback: (stats: any) => void
): Promise<UploadResult | null> => {
  if (!user) {
    return {
      success: false,
      recordCount: 0,
      message: 'Usuário não autenticado'
    };
  }
  
  try {
    progressCallback(10);
    statsCallback({ processingStatus: 'processing', message: 'Processando planilha do Painel...' });
    
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          progressCallback(20);
          
          // Process Excel file
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (!jsonData || jsonData.length === 0) {
            reject({
              success: false,
              recordCount: 0,
              message: 'Arquivo vazio ou com formato inválido'
            });
            return;
          }
          
          progressCallback(40);
          statsCallback({ 
            processingStatus: 'processing', 
            message: 'Transformando dados do Painel...',
            recordCount: jsonData.length
          });
          
          // Process data for Painel Zeladoria
          const processedData = jsonData.map((row: any) => {
            // Extract relevant fields based on the Painel Zeladoria structure
            const protocolField = row["Ordem de Serviço"] || row["Protocolo"] || "";
            
            return {
              id_os: protocolField,
              tipo_servico: row["Tipo de Serviço"] || row["Serviço"] || "",
              status: row["Status"] || "",
              distrito: row["Distrito"] || "",
              departamento: row["Departamento"] || row["Setor"] || "",
              data_abertura: parseExcelDate(row["Data de Abertura"] || ""),
              data_fechamento: parseExcelDate(row["Data de Fechamento"] || ""),
              responsavel_real: row["Responsável"] || ""
            };
          }).filter((item: any) => item.id_os); // Filter out items without ID
          
          progressCallback(60);
          
          // Get total count before insert
          const { count: totalBefore, error: countError } = await supabase
            .from('painel_zeladoria_dados')
            .select('*', { count: 'exact', head: true });
            
          if (countError) throw countError;
          
          progressCallback(70);
          
          // Register the upload
          const { data: uploadData, error: uploadError } = await supabase
            .from('painel_zeladoria_uploads')
            .insert({
              usuario_email: user.email,
              nome_arquivo: file.name
            })
            .select('id')
            .single();
    
          if (uploadError) throw uploadError;
          
          const uploadId = uploadData.id;
          
          // Add upload ID to records
          const dataWithUploadId = processedData.map(item => ({
            ...item,
            upload_id: uploadId
          }));
          
          progressCallback(80);
          statsCallback({ 
            processingStatus: 'processing', 
            message: 'Salvando dados do Painel...',
            recordCount: processedData.length,
            totalRecords: totalBefore
          });
          
          // Insert data into database
          const { error: insertError } = await supabase
            .from('painel_zeladoria_dados')
            .insert(dataWithUploadId);
            
          if (insertError) throw insertError;
          
          progressCallback(95);
          
          // Get new total after insert
          const { count: totalAfter, error: newCountError } = await supabase
            .from('painel_zeladoria_dados')
            .select('*', { count: 'exact', head: true });
            
          if (newCountError) throw newCountError;
          
          progressCallback(100);
          
          resolve({
            success: true,
            id: uploadId,
            recordCount: processedData.length,
            data: processedData,
            totalRecords: totalAfter,
            message: `${processedData.length} registros processados com sucesso`
          });
          
        } catch (error) {
          console.error('Error processing Painel upload:', error);
          reject({
            success: false,
            recordCount: 0,
            message: 'Erro ao processar arquivo do Painel'
          });
        }
      };
      
      reader.onerror = () => {
        reject({
          success: false,
          recordCount: 0,
          message: 'Erro ao ler arquivo'
        });
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (err) {
    console.error('Painel upload error:', err);
    return {
      success: false,
      recordCount: 0,
      message: 'Erro ao processar upload do Painel'
    };
  }
};

// Helper to delete uploads
export const handleDeleteUpload = async (uploadId: string, user: User | null) => {
  if (!user) return false;
  
  try {
    // First, delete related service orders
    const { error: deleteOrdersError } = await supabase
      .from('sgz_ordens_servico')
      .delete()
      .eq('sgz_upload_id', uploadId);
      
    if (deleteOrdersError) throw deleteOrdersError;
    
    // Then delete the upload record
    const { error: deleteUploadError } = await supabase
      .from('sgz_uploads')
      .delete()
      .eq('id', uploadId);
      
    if (deleteUploadError) throw deleteUploadError;
    
    return true;
  } catch (err) {
    console.error('Error deleting upload:', err);
    return false;
  }
};

// Helper function to parse Excel dates
function parseExcelDate(dateString: string) {
  if (!dateString) return null;
  
  try {
    // Try to convert first as Brazilian date (DD/MM/YYYY)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
    
    // Otherwise try as ISO or another recognized format
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString() : null;
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
}
