
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PlanilhaUpload, OrdemServico, OS156Item } from '@/components/ranking/types';

export const useDataFetcher = (
  user: User | null,
  setIsLoading: (loading: boolean) => void,
  setOrdensData: (data: OrdemServico[]) => void,
  setLastUpload: (upload: PlanilhaUpload | null) => void,
  setCompanies: (companies: string[]) => void,
  setDistricts: (districts: string[]) => void,
  setServiceTypes: (serviceTypes: string[]) => void,
  setStatusTypes: (statusTypes: string[]) => void,
  generateChartData: (data: OS156Item[]) => void
) => {
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

  return { fetchLastUpload, fetchOrdersData };
};

// Helper function to convert OrdemServico to OS156Item
export const ordensToOS156Items = (orders: OrdemServico[]): OS156Item[] => {
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
