
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrdemServico, OrdensStats, ChartFilters, ChartData } from '../types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useOrdensServico = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrdensStats | null>(null);
  const [filters, setFilters] = useState<ChartFilters>({});
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Fetch service orders
  const fetchOrdens = async (filters: ChartFilters = {}) => {
    setLoading(true);
    try {
      let query = supabase.from('ordens_servico').select('*');
      
      // Apply filters
      if (filters.distrito) {
        query = query.eq('distrito', filters.distrito);
      }
      if (filters.bairro) {
        query = query.eq('bairro', filters.bairro);
      }
      if (filters.classificacao) {
        query = query.eq('classificacao', filters.classificacao);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.dataDe) {
        query = query.gte('criado_em', filters.dataDe);
      }
      if (filters.dataAte) {
        query = query.lte('criado_em', filters.dataAte);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      setOrdens(data || []);
      
      // Fetch last update
      const { data: uploadData, error: uploadError } = await supabase
        .from('uploads_ordens_servico')
        .select('data_upload')
        .order('data_upload', { ascending: false })
        .limit(1);
        
      if (!uploadError && uploadData && uploadData.length > 0) {
        setLastUpdate(new Date(uploadData[0].data_upload).toLocaleString('pt-BR'));
      }
      
    } catch (error) {
      console.error('Erro ao buscar ordens de serviço:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as ordens de serviço.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Process data and generate statistics
  const processData = () => {
    if (!ordens.length) return;

    // Extract districts of Subprefeitura de Pinheiros
    const distritosPinheiros = ['Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'];
    
    // Basic counts
    const totalOrdens = ordens.length;
    
    // Calculate average resolution time
    const tempoMedioResolucao = ordens.reduce((acc, ordem) => {
      return acc + (ordem.dias || 0);
    }, 0) / (ordens.filter(o => o.dias !== null).length || 1);
    
    // Count by district
    const totalPorDistrito = ordens.reduce((acc, ordem) => {
      const distrito = ordem.distrito || 'Não especificado';
      acc[distrito] = (acc[distrito] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by classification
    const totalPorClassificacao = ordens.reduce((acc, ordem) => {
      const classificacao = ordem.classificacao || 'Não especificado';
      acc[classificacao] = (acc[classificacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by status
    const totalPorStatus = ordens.reduce((acc, ordem) => {
      const status = ordem.status || 'Não especificado';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by neighborhood
    const totalPorBairro = ordens.reduce((acc, ordem) => {
      const bairro = ordem.bairro || 'Não especificado';
      acc[bairro] = (acc[bairro] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({
      totalOrdens,
      tempoMedioResolucao,
      totalPorDistrito,
      totalPorClassificacao,
      totalPorStatus,
      totalPorBairro
    });
    
    // Generate charts
    generateCharts(distritosPinheiros, {
      totalPorDistrito,
      totalPorClassificacao,
      totalPorStatus,
      totalPorBairro,
      tempoMedioResolucao
    });
  };
  
  // Generate the required charts
  const generateCharts = (
    distritosPinheiros: string[], 
    data: {
      totalPorDistrito: Record<string, number>,
      totalPorClassificacao: Record<string, number>,
      totalPorStatus: Record<string, number>,
      totalPorBairro: Record<string, number>,
      tempoMedioResolucao: number
    }
  ) => {
    const newCharts: ChartData[] = [];
    
    // 1. Distribuição de Ocorrências na Subprefeitura de Pinheiros
    const distribuicaoPorDistrito = {
      id: uuidv4(),
      title: 'Distribuição de Ocorrências na Subprefeitura de Pinheiros',
      type: 'bar' as const,
      visible: true,
      data: {
        labels: distritosPinheiros,
        datasets: [{
          label: 'Número de ocorrências',
          data: distritosPinheiros.map(distrito => data.totalPorDistrito[distrito] || 0),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ]
        }]
      }
    };
    newCharts.push(distribuicaoPorDistrito);
    
    // 2. Tipos de Serviços Mais Demandados - Comparação
    // Get top 5 services
    const topServicos = Object.entries(data.totalPorClassificacao)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([servico]) => servico);
      
    const servicosPinheiros = ordens
      .filter(ordem => distritosPinheiros.includes(ordem.distrito || ''))
      .reduce((acc, ordem) => {
        const classificacao = ordem.classificacao || 'Não especificado';
        acc[classificacao] = (acc[classificacao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
    const servicosOutros = ordens
      .filter(ordem => !distritosPinheiros.includes(ordem.distrito || ''))
      .reduce((acc, ordem) => {
        const classificacao = ordem.classificacao || 'Não especificado';
        acc[classificacao] = (acc[classificacao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
    const servicosComparacao = {
      id: uuidv4(),
      title: 'Tipos de Serviços Mais Demandados - Comparação',
      type: 'groupedBar' as const,
      visible: true,
      data: {
        labels: topServicos,
        datasets: [
          {
            label: 'Subprefeitura Pinheiros',
            data: topServicos.map(servico => servicosPinheiros[servico] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: 'Outros Distritos',
            data: topServicos.map(servico => servicosOutros[servico] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      }
    };
    newCharts.push(servicosComparacao);
    
    // 3. Tempo Médio de Resolução (em dias)
    const tempoMedioPorDistrito = distritosPinheiros.reduce((acc, distrito) => {
      const ordensDoDistrito = ordens.filter(o => o.distrito === distrito && o.dias !== null);
      if (ordensDoDistrito.length) {
        acc[distrito] = ordensDoDistrito.reduce((sum, o) => sum + (o.dias || 0), 0) / ordensDoDistrito.length;
      } else {
        acc[distrito] = 0;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const tempoMedioResolucao = {
      id: uuidv4(),
      title: 'Tempo Médio de Resolução (em dias)',
      type: 'indicator' as const,
      visible: true,
      data: {
        total: data.tempoMedioResolucao.toFixed(1),
        details: Object.entries(tempoMedioPorDistrito).map(([distrito, tempo]) => ({
          label: distrito,
          value: tempo.toFixed(1)
        }))
      }
    };
    newCharts.push(tempoMedioResolucao);
    
    // 4. Distribuição das Ocorrências por Bairros da Subprefeitura
    const bairrosPinheiros = Object.keys(data.totalPorBairro).filter(bairro => {
      return ordens.some(o => o.bairro === bairro && distritosPinheiros.includes(o.distrito || ''));
    });
    
    const ocorrenciasPorBairro = bairrosPinheiros.reduce((acc, bairro) => {
      acc[bairro] = ordens.filter(o => o.bairro === bairro && distritosPinheiros.includes(o.distrito || '')).length;
      return acc;
    }, {} as Record<string, number>);
    
    const topBairros = Object.entries(ocorrenciasPorBairro)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, [bairro, count]) => {
        acc[bairro] = count;
        return acc;
      }, {} as Record<string, number>);
    
    const distribuicaoPorBairro = {
      id: uuidv4(),
      title: 'Distribuição das Ocorrências por Bairros da Subprefeitura',
      type: 'pie' as const,
      visible: true,
      data: {
        labels: Object.keys(topBairros),
        datasets: [{
          data: Object.values(topBairros),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(40, 159, 64, 0.6)',
            'rgba(210, 199, 199, 0.6)'
          ]
        }]
      }
    };
    newCharts.push(distribuicaoPorBairro);
    
    // 5. Serviços Mais Frequentes nos Distritos da Subprefeitura de Pinheiros
    const servicosPorDistrito = distritosPinheiros.reduce((acc, distrito) => {
      const servicosDistrito = ordens
        .filter(o => o.distrito === distrito)
        .reduce((servAcc, ordem) => {
          const servico = ordem.classificacao || 'Não especificado';
          servAcc[servico] = (servAcc[servico] || 0) + 1;
          return servAcc;
        }, {} as Record<string, number>);
        
      // Get top 3 services for this district
      const topServicosDistrito = Object.entries(servicosDistrito)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([servico, count]) => ({ servico, count }));
        
      acc[distrito] = topServicosDistrito;
      return acc;
    }, {} as Record<string, Array<{servico: string, count: number}>>);
    
    // Prepare data for horizontal bar chart
    const servicosMaisFrequentes = {
      id: uuidv4(),
      title: 'Serviços Mais Frequentes nos Distritos da Subprefeitura de Pinheiros',
      type: 'horizontalBar' as const,
      visible: true,
      data: {
        datasets: distritosPinheiros.flatMap(distrito => {
          return (servicosPorDistrito[distrito] || []).map(({ servico, count }, index) => ({
            label: `${distrito} - ${servico}`,
            data: [count],
            backgroundColor: [
              distrito === 'Itaim Bibi' ? 'rgba(255, 99, 132, 0.6)' :
              distrito === 'Pinheiros' ? 'rgba(54, 162, 235, 0.6)' :
              distrito === 'Alto de Pinheiros' ? 'rgba(255, 206, 86, 0.6)' :
              'rgba(75, 192, 192, 0.6)'
            ]
          }));
        })
      }
    };
    newCharts.push(servicosMaisFrequentes);
    
    // 6. Comparação de Status entre Geral e Subprefeitura de Pinheiros
    const statusPinheiros = ordens
      .filter(ordem => distritosPinheiros.includes(ordem.distrito || ''))
      .reduce((acc, ordem) => {
        const status = ordem.status || 'Não especificado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
    const statusGeral = data.totalPorStatus;
    
    // Get all unique statuses
    const allStatuses = [...new Set([...Object.keys(statusPinheiros), ...Object.keys(statusGeral)])];
    
    const comparacaoStatus = {
      id: uuidv4(),
      title: 'Comparação de Status entre Geral e Subprefeitura de Pinheiros',
      type: 'groupedBar' as const,
      visible: true,
      data: {
        labels: allStatuses,
        datasets: [
          {
            label: 'Subprefeitura Pinheiros',
            data: allStatuses.map(status => statusPinheiros[status] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: 'Geral',
            data: allStatuses.map(status => statusGeral[status] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      }
    };
    newCharts.push(comparacaoStatus);
    
    setCharts(newCharts);
  };
  
  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/process-xls-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Upload concluído',
        description: result.message,
      });
      
      // Reload data
      fetchOrdens(filters);
      
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast({
        title: 'Erro',
        description: `Falha ao processar o arquivo: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  // Generate updated charts with new filters
  const generateUpdatedCharts = (newFilters: ChartFilters) => {
    setFilters(newFilters);
    fetchOrdens(newFilters);
  };
  
  // Toggle chart visibility
  const toggleChartVisibility = (chartId: string) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId ? { ...chart, visible: !chart.visible } : chart
    ));
  };
  
  // Effect to process data when ordens change
  useEffect(() => {
    if (!loading && ordens.length > 0) {
      processData();
    }
  }, [ordens, loading]);
  
  // Initial fetch
  useEffect(() => {
    fetchOrdens(filters);
  }, []);
  
  return {
    ordens,
    stats,
    charts,
    loading,
    filters,
    lastUpdate,
    fetchOrdens,
    handleFileUpload,
    generateUpdatedCharts,
    toggleChartVisibility
  };
};
