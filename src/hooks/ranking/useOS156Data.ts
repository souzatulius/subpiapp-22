
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OS156Item, OS156Upload, OS156ChartData, OS156FilterOptions } from '@/components/ranking/types';
import { User } from '@supabase/supabase-js';

// Helper to parse Excel/CSV data and map to the correct format
const processPlanilha156 = async (file: File): Promise<OS156Item[]> => {
  try {
    // In a real implementation, we would parse the Excel file
    // For this demo, we're just returning a placeholder
    console.log('Processing file:', file.name);
    
    // This is a placeholder for the actual parsing logic
    return [];
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Não foi possível processar o arquivo. Verifique se está no formato correto.');
  }
};

const mapAreaTecnica = (tipoServico: string): 'STM' | 'STLP' | null => {
  const stlpServices = [
    'AREAS AJARDINADAS',
    'AREAS AJARDINADAS MANUAL (TIPO A)',
    'HIDROJATO (MICRODRENAGEM MECANIZADA)',
    'LIMPEZA DE CORREGOS',
    'LIMPEZA MANUAL DE CORREGOS',
    'MICRODRENAGEM',
    'PODA REMOCAO ARVORES',
    'PODA REMOCAO MANEJO ARVORE'
  ];
  
  const stmServices = [
    'SERRALHERIA',
    'CONSERVACAO GALERIAS',
    'MANUTENCAO CONSERVACAO GALERIAS',
    'CONSERVACAO LOGRADOUROS',
    'CONSERVACAO LOGRADOUROS PUBLICOS',
    'GALERIAS SABESP'
  ];
  
  if (stlpServices.includes(tipoServico)) return 'STLP';
  if (stmServices.includes(tipoServico)) return 'STM';
  return null;
};

export const useOS156Data = (user: User | null) => {
  const { toast } = useToast();
  const [lastUpload, setLastUpload] = useState<OS156Upload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [osData, setOsData] = useState<OS156Item[]>([]);
  const [chartData, setChartData] = useState<OS156ChartData | null>(null);

  const fetchLastUpload = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('os_uploads')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data_upload', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          nome_arquivo: data[0].nome_arquivo,
          data_upload: new Date(data[0].data_upload).toLocaleString(),
          processado: data[0].processado
        });
        
        // If there's a last upload, fetch its data
        await fetchOSData(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar último upload:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do último upload.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const fetchOSData = async (uploadId: string) => {
    try {
      const { data, error } = await supabase
        .from('ordens_156')
        .select('*')
        .eq('upload_id', uploadId);

      if (error) throw error;

      if (data) {
        setOsData(data as OS156Item[]);
        generateChartData(data as OS156Item[]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados das ordens:', error);
      toast({
        title: "Erro ao carregar ordens",
        description: "Não foi possível carregar os dados das ordens de serviço.",
        variant: "destructive",
      });
    }
  };

  const generateChartData = (data: OS156Item[]) => {
    // Generate chart data based on the OS data
    // This is where we would implement the logic for each chart

    // Sample implementation for statusDistribution
    const statusCounts: Record<string, number> = {};
    data.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });

    // Convert to Chart.js format
    const statusLabels = Object.keys(statusCounts);
    const statusData = statusLabels.map(label => statusCounts[label]);
    
    const statusDistribution = {
      labels: statusLabels,
      datasets: [
        {
          label: 'Distribuição por Status',
          data: statusData,
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',  // Orange
            'rgba(54, 162, 235, 0.8)',  // Blue
            'rgba(255, 206, 86, 0.8)',  // Yellow
            'rgba(75, 192, 192, 0.8)',  // Green
            'rgba(153, 102, 255, 0.8)', // Purple
            'rgba(255, 159, 64, 0.8)',  // Orange
            'rgba(199, 199, 199, 0.8)', // Grey
          ],
          borderWidth: 1
        }
      ]
    };

    // Calculate average time by status
    const statusTimes: Record<string, number[]> = {};
    data.forEach(item => {
      if (!statusTimes[item.status]) statusTimes[item.status] = [];
      statusTimes[item.status].push(item.tempo_aberto);
    });

    const avgTimeByStatus = Object.keys(statusTimes).map(status => ({
      status,
      avg: statusTimes[status].reduce((sum, time) => sum + time, 0) / statusTimes[status].length
    }));

    const averageTimeByStatus = {
      labels: avgTimeByStatus.map(item => item.status),
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: avgTimeByStatus.map(item => item.avg),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Companies performance
    const companies: Record<string, { total: number, completed: number }> = {};
    data.forEach(item => {
      if (!item.empresa) return;
      
      if (!companies[item.empresa]) {
        companies[item.empresa] = { total: 0, completed: 0 };
      }
      
      companies[item.empresa].total += 1;
      if (item.status === 'CONC') {
        companies[item.empresa].completed += 1;
      }
    });

    const companiesData = Object.entries(companies)
      .map(([name, stats]) => ({ name, completed: stats.completed }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10);

    const companiesPerformance = {
      labels: companiesData.map(item => item.name),
      datasets: [
        {
          label: 'Obras Concluídas',
          data: companiesData.map(item => item.completed),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Services by technical area
    const areaServices: Record<string, Record<string, number>> = {
      STM: {},
      STLP: {}
    };

    data.forEach(item => {
      if (item.area_tecnica) {
        if (!areaServices[item.area_tecnica][item.tipo_servico]) {
          areaServices[item.area_tecnica][item.tipo_servico] = 0;
        }
        areaServices[item.area_tecnica][item.tipo_servico] += 1;
      }
    });

    const stmServices = Object.entries(areaServices.STM)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stlpServices = Object.entries(areaServices.STLP)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const servicesByTechnicalArea = {
      labels: [...new Set([...stmServices.map(s => s.service), ...stlpServices.map(s => s.service)])],
      datasets: [
        {
          label: 'STM',
          data: stmServices.map(s => s.count),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'STLP',
          data: stlpServices.map(s => s.count),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Services by district
    const districtServices: Record<string, number> = {};
    data.forEach(item => {
      if (item.distrito) {
        districtServices[item.distrito] = (districtServices[item.distrito] || 0) + 1;
      }
    });

    const servicesByDistrict = {
      labels: Object.keys(districtServices),
      datasets: [
        {
          label: 'Serviços por Distrito',
          data: Object.values(districtServices),
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };

    // Build complete chart data object
    setChartData({
      statusDistribution,
      averageTimeByStatus,
      companiesPerformance,
      servicesByTechnicalArea,
      servicesByDistrict,
      timeToCompletion: {}, // Placeholder
      efficiencyScore: {}, // Placeholder
      dailyNewOrders: {}, // Placeholder
      servicesDiversity: {} // Placeholder
    });
  };
  
  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create upload record in database
      const { data: uploadData, error: uploadError } = await supabase
        .from('os_uploads')
        .insert({
          usuario_id: user.id,
          nome_arquivo: file.name,
        })
        .select();

      if (uploadError) throw uploadError;

      if (!uploadData || uploadData.length === 0) {
        throw new Error("Erro ao registrar upload");
      }

      const uploadId = uploadData[0].id;
      
      // Process the file data
      const osItems = await processPlanilha156(file);
      
      // For each OS item, determine its technical area and save to database
      const processedItems = osItems.map(item => ({
        ...item,
        upload_id: uploadId,
        area_tecnica: mapAreaTecnica(item.tipo_servico) || 'STM', // Default to STM if unknown
        servico_valido: ['PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'].includes(item.distrito)
      }));
      
      // Insert OS items
      if (processedItems.length > 0) {
        const { error: insertError } = await supabase
          .from('ordens_156')
          .insert(processedItems);
  
        if (insertError) throw insertError;
      }
      
      // Call the function to process the upload (detect changes, etc.)
      const { error: functionError } = await supabase.rpc('processar_upload_os_156', {
        upload_id: uploadId
      });
      
      if (functionError) throw functionError;

      // Update the last upload state and fetch its data
      setLastUpload({
        id: uploadId,
        nome_arquivo: file.name,
        data_upload: new Date().toLocaleString(),
        processado: true
      });
      
      await fetchOSData(uploadId);

      toast({
        title: "Upload concluído",
        description: "A planilha foi processada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao processar planilha:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLastUpload = async () => {
    if (!lastUpload || !user) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('os_uploads')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      setLastUpload(null);
      setOsData([]);
      setChartData(null);
      
      toast({
        title: "Upload removido",
        description: "O arquivo foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao remover upload:', error);
      toast({
        title: "Erro ao remover",
        description: error.message || "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (filters: OS156FilterOptions) => {
    if (!osData.length) return;
    
    let filteredData = [...osData];
    
    // Apply status filter
    if (filters.statuses && !filters.statuses.includes('Todos')) {
      filteredData = filteredData.filter(item => filters.statuses.includes(item.status));
    }
    
    // Apply area tecnica filter
    if (filters.areaTecnica !== 'Todos') {
      filteredData = filteredData.filter(item => item.area_tecnica === filters.areaTecnica);
    }
    
    // Apply company filter
    if (filters.empresa && filters.empresa.length > 0 && !filters.empresa.includes('Todos')) {
      filteredData = filteredData.filter(item => item.empresa && filters.empresa.includes(item.empresa));
    }
    
    // Apply date range filter
    if (filters.dataInicio) {
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) >= new Date(filters.dataInicio!)
      );
    }
    
    if (filters.dataFim) {
      filteredData = filteredData.filter(item => 
        new Date(item.data_criacao) <= new Date(filters.dataFim!)
      );
    }
    
    // Apply district filter
    if (filters.districts && !filters.districts.includes('Todos')) {
      filteredData = filteredData.filter(item => 
        item.distrito && filters.districts.includes(item.distrito)
      );
    }
    
    // Generate new chart data based on filtered data
    generateChartData(filteredData);
  };

  // Fetch data when component mounts or when user changes
  useEffect(() => {
    fetchLastUpload();
  }, [user, fetchLastUpload]);

  return {
    lastUpload,
    isLoading,
    osData,
    chartData,
    fetchLastUpload,
    handleFileUpload,
    deleteLastUpload,
    applyFilters
  };
};
