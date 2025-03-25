
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SGZOrdemServico, SGZPlanilhaUpload, SGZFilterOptions, SGZChartData, SGZAreaTecnica } from '@/types/sgz';
import { processExcelFile } from './utils/sgzDataProcessing';
import { toast } from 'sonner';

export const useSGZData = (user: User | null) => {
  const [ordens, setOrdens] = useState<SGZOrdemServico[]>([]);
  const [lastUpload, setLastUpload] = useState<SGZPlanilhaUpload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chartData, setChartData] = useState<SGZChartData | null>(null);
  const [filters, setFilters] = useState<SGZFilterOptions>({
    status: ['Todos'],
    areaTecnica: 'Todos',
    distrito: ['Todos'],
    fornecedor: ['Todos']
  });

  // Fetch last upload and its data
  const fetchLastUpload = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Get last upload
      const { data: uploadData, error: uploadError } = await supabase
        .from('sgz_planilhas_upload')
        .select('*')
        .eq('usuario_upload', user.id)
        .order('data_upload', { ascending: false })
        .limit(1);

      if (uploadError) throw uploadError;

      if (uploadData && uploadData.length > 0) {
        const upload = uploadData[0] as SGZPlanilhaUpload;
        setLastUpload(upload);

        // Fetch service orders for this upload
        await fetchOrdensData(upload.id!);

        // Generate chart data
        await generateChartData(upload.id!);
      } else {
        setOrdens([]);
        setChartData(null);
      }
    } catch (error: any) {
      console.error('Error fetching last upload:', error);
      toast.error('Erro ao carregar dados do último upload');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch service orders data
  const fetchOrdensData = async (uploadId: string) => {
    try {
      const { data, error } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .eq('planilha_referencia', uploadId);

      if (error) throw error;

      if (data) {
        // Ensure the area_tecnica is valid
        const validatedOrdens = data.map(ordem => {
          // Make sure sgz_area_tecnica is either STM or STLP
          let areaTecnica: SGZAreaTecnica = 'STM'; // Default
          
          if (ordem.sgz_area_tecnica === 'STLP') {
            areaTecnica = 'STLP';
          } else if (ordem.sgz_area_tecnica === 'STM') {
            areaTecnica = 'STM';
          } else {
            console.warn(`Invalid area_tecnica found: ${ordem.sgz_area_tecnica}, defaulting to STM`);
          }
          
          return {
            ...ordem,
            sgz_area_tecnica: areaTecnica
          } as SGZOrdemServico;
        });
        
        setOrdens(validatedOrdens);
      }
    } catch (error: any) {
      console.error('Error fetching service orders:', error);
      toast.error('Erro ao carregar ordens de serviço');
    }
  };

  // Generate chart data based on current service orders
  const generateChartData = async (uploadId: string) => {
    try {
      const { data: ordensData, error } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .eq('planilha_referencia', uploadId);

      if (error) throw error;

      if (!ordensData || ordensData.length === 0) {
        setChartData(null);
        return;
      }

      // Validate and transform data
      const validatedOrdens = ordensData.map(ordem => {
        let areaTecnica: SGZAreaTecnica = 'STM'; // Default
        
        if (ordem.sgz_area_tecnica === 'STLP') {
          areaTecnica = 'STLP';
        } else if (ordem.sgz_area_tecnica === 'STM') {
          areaTecnica = 'STM';
        }
        
        return {
          ...ordem,
          sgz_area_tecnica: areaTecnica
        } as SGZOrdemServico;
      });

      // Status distribution
      const statusCounts: Record<string, number> = {};
      validatedOrdens.forEach((ordem: SGZOrdemServico) => {
        statusCounts[ordem.sgz_status] = (statusCounts[ordem.sgz_status] || 0) + 1;
      });

      // Area distribution
      const areaCounts = {
        STM: validatedOrdens.filter((ordem: SGZOrdemServico) => ordem.sgz_area_tecnica === 'STM').length,
        STLP: validatedOrdens.filter((ordem: SGZOrdemServico) => ordem.sgz_area_tecnica === 'STLP').length
      };

      // Most frequent services
      const serviceCounts: Record<string, number> = {};
      validatedOrdens.forEach((ordem: SGZOrdemServico) => {
        serviceCounts[ordem.sgz_classificacao_servico] = (serviceCounts[ordem.sgz_classificacao_servico] || 0) + 1;
      });

      // Sort services by count and take top 10
      const topServices = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      // Average time by status
      const statusTimes: Record<string, number[]> = {};
      validatedOrdens.forEach((ordem: SGZOrdemServico) => {
        if (!statusTimes[ordem.sgz_status]) statusTimes[ordem.sgz_status] = [];
        if (ordem.sgz_dias_ate_status_atual) {
          statusTimes[ordem.sgz_status].push(ordem.sgz_dias_ate_status_atual);
        }
      });

      const avgTimeByStatus = Object.entries(statusTimes).map(([status, times]) => ({
        status,
        avg: times.reduce((sum, time) => sum + time, 0) / times.length
      }));

      // Distribution by district
      const districtCounts: Record<string, number> = {};
      validatedOrdens.forEach((ordem: SGZOrdemServico) => {
        if (ordem.sgz_distrito) {
          districtCounts[ordem.sgz_distrito] = (districtCounts[ordem.sgz_distrito] || 0) + 1;
        }
      });

      // Evolution of status (simplified for now)
      const statusEvolution = {
        labels: ['Anterior', 'Atual'],
        datasets: [
          {
            label: 'Novos',
            data: [0, statusCounts['NOVO'] || 0]
          },
          {
            label: 'Em Andamento',
            data: [0, (statusCounts['AB'] || 0) + (statusCounts['PE'] || 0)]
          },
          {
            label: 'Concluídos',
            data: [0, statusCounts['CONC'] || 0]
          }
        ]
      };

      // Create chart data object
      const newChartData: SGZChartData = {
        statusDistribution: {
          labels: Object.keys(statusCounts),
          datasets: [{
            label: 'Distribuição por Status',
            data: Object.values(statusCounts),
            backgroundColor: Object.keys(statusCounts).map((_, index) => 
              `rgba(${245 - index * 15}, ${124 - index * 10}, 53, 0.8)`
            )
          }]
        },
        areaDistribution: {
          labels: ['STM', 'STLP'],
          datasets: [{
            label: 'Distribuição por Área Técnica',
            data: [areaCounts.STM, areaCounts.STLP],
            backgroundColor: ['rgba(245, 124, 53, 0.8)', 'rgba(75, 192, 192, 0.8)']
          }]
        },
        servicosFrequentes: {
          labels: Object.keys(topServices),
          datasets: [{
            label: 'Serviços mais frequentes',
            data: Object.values(topServices),
            backgroundColor: Object.keys(topServices).map((_, index) => 
              `rgba(${245 - index * 15}, ${124 - index * 10}, 53, 0.8)`
            )
          }]
        },
        tempoMedioPorStatus: {
          labels: avgTimeByStatus.map(item => item.status),
          datasets: [{
            label: 'Tempo médio (dias)',
            data: avgTimeByStatus.map(item => item.avg),
            backgroundColor: avgTimeByStatus.map((_, index) => 
              `rgba(${245 - index * 15}, ${124 - index * 10}, 53, 0.8)`
            )
          }]
        },
        distribuicaoPorDistrito: {
          labels: Object.keys(districtCounts),
          datasets: [{
            label: 'Distribuição por Distrito',
            data: Object.values(districtCounts),
            backgroundColor: Object.keys(districtCounts).map((_, index) => 
              `rgba(${245 - index * 15}, ${124 - index * 10}, 53, 0.8)`
            )
          }]
        },
        evolucaoStatus: statusEvolution,
        lastUpdated: new Date().toISOString()
      };

      setChartData(newChartData);
      
      // Save user config with chart data
      if (user) {
        try {
          await supabase
            .from('sgz_configuracoes_usuario')
            .upsert({
              usuario_id: user.id,
              filtros_ativos: JSON.stringify(filters),
              cards_visiveis: ['statusDistribution', 'areaDistribution', 'servicosFrequentes', 
                            'tempoMedioPorStatus', 'distribuicaoPorDistrito', 'evolucaoStatus'],
              data_atualizacao: new Date().toISOString()
            });
        } catch (error) {
          console.error('Error saving user configuration:', error);
        }
      }
    } catch (error: any) {
      console.error('Error generating chart data:', error);
      toast.error('Erro ao gerar gráficos');
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!user) {
      throw new Error('Você precisa estar logado para fazer upload');
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      throw new Error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
    }

    setIsUploading(true);
    setUploadProgress(5);

    try {
      // First, create upload record
      const { data: uploadData, error: uploadError } = await supabase
        .from('sgz_planilhas_upload')
        .insert({
          arquivo_nome: file.name,
          usuario_upload: user.id,
          status_upload: 'processando'
        })
        .select();

      if (uploadError) throw uploadError;

      if (!uploadData || uploadData.length === 0) {
        throw new Error('Erro ao registrar upload');
      }

      const uploadId = uploadData[0].id;
      setUploadProgress(20);

      // Process the file
      const ordensData = await processExcelFile(file);
      setUploadProgress(40);

      // Validate the area_tecnica field in each row
      ordensData.forEach(ordem => {
        if (!ordem.sgz_area_tecnica || (ordem.sgz_area_tecnica !== 'STM' && ordem.sgz_area_tecnica !== 'STLP')) {
          throw new Error(`Valor inválido para Área Técnica: "${ordem.sgz_area_tecnica}". Apenas "STM" ou "STLP" são permitidos.`);
        }
      });

      // Prepare orders for database
      const ordensToInsert = ordensData.map(ordem => ({
        ...ordem,
        planilha_referencia: uploadId
      }));

      setUploadProgress(60);

      // Insert service orders in batches to avoid hitting request size limits
      const batchSize = 100;
      for (let i = 0; i < ordensToInsert.length; i += batchSize) {
        const batch = ordensToInsert.slice(i, i + batchSize);
        const { error } = await supabase
          .from('sgz_ordens_servico')
          .insert(batch);

        if (error) throw error;
        
        const progress = 60 + ((i / ordensToInsert.length) * 30);
        setUploadProgress(Math.min(90, progress));
      }

      // Update upload record with results
      await supabase
        .from('sgz_planilhas_upload')
        .update({
          qtd_ordens_processadas: ordensData.length,
          qtd_ordens_validas: ordensData.length,
          status_upload: 'sucesso'
        })
        .eq('id', uploadId);

      setUploadProgress(95);

      // Fetch the new data
      await fetchLastUpload();
      setUploadProgress(100);

      toast.success('Planilha processada com sucesso');
      
      // Small delay to show 100% progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Erro ao processar planilha: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete last upload
  const deleteLastUpload = async () => {
    if (!lastUpload || !user) return;

    setIsLoading(true);
    try {
      // Delete service orders
      const { error: ordensError } = await supabase
        .from('sgz_ordens_servico')
        .delete()
        .eq('planilha_referencia', lastUpload.id);

      if (ordensError) throw ordensError;

      // Delete upload record
      const { error: uploadError } = await supabase
        .from('sgz_planilhas_upload')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_upload', user.id);

      if (uploadError) throw uploadError;

      setLastUpload(null);
      setOrdens([]);
      setChartData(null);
      
      toast.success('Upload removido com sucesso');
    } catch (error: any) {
      console.error('Error deleting upload:', error);
      toast.error(`Erro ao remover upload: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to the data
  const applyFilters = (newFilters: SGZFilterOptions) => {
    setFilters(newFilters);
    
    // Save user preferences
    if (user) {
      try {
        supabase
          .from('sgz_configuracoes_usuario')
          .upsert({
            usuario_id: user.id,
            filtros_ativos: JSON.stringify(newFilters),
            data_atualizacao: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error saving user preferences:', error);
      }
    }
  };

  // Load user preferences on init
  useEffect(() => {
    if (user) {
      supabase
        .from('sgz_configuracoes_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            if (data.filtros_ativos) {
              try {
                const parsed = JSON.parse(data.filtros_ativos as string);
                setFilters(parsed as SGZFilterOptions);
              } catch (e) {
                console.error('Error parsing saved filters:', e);
              }
            }
          }
        });
    }
  }, [user]);

  // Fetch data on component mount
  useEffect(() => {
    fetchLastUpload();
  }, [fetchLastUpload]);

  return {
    ordens,
    lastUpload,
    isLoading,
    isUploading,
    uploadProgress,
    chartData,
    filters,
    handleFileUpload,
    deleteLastUpload,
    applyFilters,
    fetchLastUpload
  };
};
