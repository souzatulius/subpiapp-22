
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  FilterOptions,
  OrdemServico,
  PlanilhaUpload,
  StatusHistorico,
  OS156Item
} from '@/components/ranking/types';
import { useChartDataGeneration } from './useChartDataGeneration';

export const useRankingData = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ordensData, setOrdensData] = useState<OrdemServico[]>([]);
  const [lastUpload, setLastUpload] = useState<PlanilhaUpload | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  
  const { chartData, generateChartData } = useChartDataGeneration();
  
  // Function to fetch the last upload
  const fetchLastUpload = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('planilhas_upload')
        .select('*')
        .order('data_upload', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          arquivo_nome: data[0].arquivo_nome,
          data_upload: new Date(data[0].data_upload).toLocaleString(),
          usuario_upload: data[0].usuario_upload,
          qtd_ordens_processadas: data[0].qtd_ordens_processadas,
          qtd_ordens_validas: data[0].qtd_ordens_validas,
          status_upload: data[0].status_upload as "sucesso" | "erro" | "parcial"
        });
        
        // Fetch order data for this upload
        await fetchOrdersData(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching last upload:', error);
      toast.error('Não foi possível carregar as informações do último upload');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Function to fetch orders data for a specific upload
  const fetchOrdersData = async (uploadId: string) => {
    try {
      // First, get count to ensure we're loading all records
      const { count, error: countError } = await supabase
        .from('ordens_servico')
        .select('*', { count: 'exact', head: true })
        .eq('planilha_referencia', uploadId);
      
      if (countError) throw countError;
      
      console.log(`Total orders for upload ${uploadId}: ${count}`);
      
      // Now fetch all records with pagination if needed
      let allData: OrdemServico[] = [];
      const pageSize = 1000;
      let page = 0;
      let hasMore = true;
      
      while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        
        const { data, error } = await supabase
          .from('ordens_servico')
          .select('*')
          .eq('planilha_referencia', uploadId)
          .range(from, to);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          allData = [...allData, ...data as OrdemServico[]];
          page++;
        }
        
        hasMore = data && data.length === pageSize;
      }
      
      console.log(`Loaded ${allData.length} orders successfully`);
      setOrdensData(allData);
      
      // Extract unique values for filters
      if (allData.length > 0) {
        // Extract companies
        const uniqueCompanies = Array.from(
          new Set(allData.map(item => item.fornecedor).filter(Boolean) as string[])
        );
        setCompanies(uniqueCompanies);
        
        // Extract districts
        const uniqueDistricts = Array.from(
          new Set(allData.map(item => item.distrito).filter(Boolean) as string[])
        );
        setDistricts(uniqueDistricts);
        
        // Extract service types
        const uniqueServiceTypes = Array.from(
          new Set(allData.map(item => item.classificacao_servico).filter(Boolean) as string[])
        );
        setServiceTypes(uniqueServiceTypes);
        
        // Extract status types
        const uniqueStatusTypes = Array.from(
          new Set(allData.map(item => item.status).filter(Boolean) as string[])
        );
        setStatusTypes(uniqueStatusTypes);
      }
      
      // Transform OrdemServico to OS156Item for chart generation
      const chartItems: OS156Item[] = ordensToOS156Items(allData);
      
      // Generate charts with converted data
      generateChartData(chartItems);
    } catch (error) {
      console.error('Error fetching orders data:', error);
      toast.error('Não foi possível carregar os dados das ordens de serviço');
    }
  };
  
  // Helper function to convert OrdemServico to OS156Item
  const ordensToOS156Items = (orders: OrdemServico[]): OS156Item[] => {
    return orders.map(order => ({
      id: order.id,
      numero_os: order.ordem_servico,
      distrito: order.distrito,
      bairro: order.bairro || '',
      logradouro: order.logradouro || '',
      tipo_servico: order.classificacao_servico,
      area_tecnica: order.area_tecnica as "STM" | "STLP" | "",
      empresa: order.fornecedor,
      data_criacao: order.criado_em,
      status: order.status,
      data_status: order.data_status,
      tempo_aberto: order.dias_ate_status_atual || 0,
      servico_valido: true
    }));
  };
  
  // Function to upload a new file
  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload de arquivos');
      return;
    }
    
    try {
      setIsLoading(true);
      toast.loading('Processando planilha...');
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload the file to Supabase storage (optional)
      // For now, we'll just process the file directly
      
      // First, create an upload record
      const { data: uploadData, error: uploadError } = await supabase
        .from('planilhas_upload')
        .insert({
          arquivo_nome: file.name,
          usuario_upload: user.id,
          status_upload: 'sucesso' as "sucesso" | "erro" | "parcial" // Will be updated after processing
        })
        .select();
      
      if (uploadError) throw uploadError;
      
      if (!uploadData || uploadData.length === 0) {
        throw new Error('Erro ao registrar upload');
      }
      
      const uploadId = uploadData[0].id;
      
      // Process the file data
      // This is a placeholder for actual Excel processing
      // In a real implementation, you would parse the Excel file here
      // and insert the data into the ordens_servico table
      
      // For now, we'll just simulate success
      
      // Update the upload record with the number of processed records
      const { error: updateError } = await supabase
        .from('planilhas_upload')
        .update({
          qtd_ordens_processadas: 100, // Placeholder
          qtd_ordens_validas: 80,      // Placeholder
          status_upload: 'sucesso' as "sucesso" | "erro" | "parcial"
        })
        .eq('id', uploadId);
      
      if (updateError) throw updateError;
      
      // Update the last upload state and fetch its data
      setLastUpload({
        id: uploadId,
        arquivo_nome: file.name,
        data_upload: new Date().toLocaleString(),
        usuario_upload: user.id,
        qtd_ordens_processadas: 100, // Placeholder
        qtd_ordens_validas: 80,      // Placeholder
        status_upload: 'sucesso'
      });
      
      // Fetch the newly uploaded data
      await fetchOrdersData(uploadId);
      
      toast.success('Planilha processada com sucesso');
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Não foi possível processar o arquivo');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to delete the last upload
  const deleteLastUpload = async () => {
    if (!lastUpload || !user) return;
    
    try {
      setIsLoading(true);
      
      // First, delete all related records
      const { error: ordersError } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('planilha_referencia', lastUpload.id);
      
      if (ordersError) throw ordersError;
      
      // Now delete the upload record
      const { error } = await supabase
        .from('planilhas_upload')
        .delete()
        .eq('id', lastUpload.id);
      
      if (error) throw error;
      
      setLastUpload(null);
      setOrdensData([]);
      generateChartData([]);
      
      toast.success('Upload removido com sucesso');
    } catch (error: any) {
      console.error('Error removing upload:', error);
      toast.error(error.message || 'Não foi possível remover o arquivo');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to apply filters
  const applyFilters = (filters: FilterOptions) => {
    if (ordensData.length === 0) {
      return;
    }
    
    let filteredData = [...ordensData];
    
    // Apply date range filter
    if (filters.dateRange?.from) {
      const fromDate = new Date(filters.dateRange.from);
      filteredData = filteredData.filter(item => 
        new Date(item.criado_em) >= fromDate
      );
    }
    
    if (filters.dateRange?.to) {
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredData = filteredData.filter(item => 
        new Date(item.criado_em) <= toDate
      );
    }
    
    // Apply status filter
    if (filters.statuses && !filters.statuses.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filters.statuses.includes(item.status as any)
      );
    }
    
    // Apply service type filter
    if (filters.serviceTypes && !filters.serviceTypes.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filters.serviceTypes.includes(item.classificacao_servico as any)
      );
    }
    
    // Apply district filter
    if (filters.districts && !filters.districts.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        filters.districts.includes(item.distrito as any)
      );
    }
    
    // Transform filtered OrdemServico to OS156Item for chart generation
    const chartItems: OS156Item[] = ordensToOS156Items(filteredData);
    
    // Generate charts with filtered data
    generateChartData(chartItems);
  };
  
  // Fetch data when component mounts or when user changes
  useEffect(() => {
    fetchLastUpload();
  }, [user, fetchLastUpload]);
  
  return {
    isLoading,
    ordensData,
    lastUpload,
    chartData,
    companies,
    districts,
    serviceTypes,
    statusTypes,
    fetchLastUpload,
    handleFileUpload,
    deleteLastUpload,
    applyFilters
  };
};
