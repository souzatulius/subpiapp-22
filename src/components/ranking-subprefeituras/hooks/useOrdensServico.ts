
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  OrdemServico,
  UploadLog,
  ChartData,
  ChartFilters,
  OrdensStats,
} from '../types';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

const defaultChartData: ChartData[] = [
  {
    id: 'tempo-medio-resolucao',
    title: 'Tempo Médio de Resolução',
    description: 'Média de dias para resolução das ordens de serviço',
    type: 'indicator',
    data: { total: '0', details: [{ label: 'Média', value: '0' }, { label: 'Mediana', value: '0' }] },
    visible: true,
  },
  {
    id: 'ordens-por-distrito',
    title: 'Ordens de Serviço por Distrito',
    type: 'horizontalBar',
    data: { datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-por-bairro',
    title: 'Ordens de Serviço por Bairro',
    type: 'bar',
    data: { labels: [], datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-por-classificacao',
    title: 'Ordens de Serviço por Classificação',
    type: 'pie',
    data: { labels: [], datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-por-status',
    title: 'Ordens de Serviço por Status',
    type: 'pie',
    data: { labels: [], datasets: [] },
    visible: true,
  },
  {
    id: 'ordens-criadas-por-mes',
    title: 'Ordens de Serviço Criadas por Mês',
    type: 'line',
    data: { labels: [], datasets: [] },
    visible: true,
  },
];

const useOrdensServico = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>(defaultChartData);
  const [stats, setStats] = useState<OrdensStats | null>(null);
  const [filters, setFilters] = useState<ChartFilters>({});
  const { toast } = useToast();

  const fetchOrdens = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ordens_servico')
        .select('*')
        .order('criado_em', { ascending: false });

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

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar ordens:', error);
        toast({
          title: "Erro ao buscar ordens de serviço!",
          description: "Ocorreu um problema ao carregar os dados.",
          variant: "destructive",
        });
      }

      if (data) {
        setOrdens(data as OrdemServico[]);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const fetchUploadLogs = useCallback(async () => {
    try {
      // Note: This is a custom table that might not exist yet in the Supabase schema
      const { data, error } = await supabase
        .from('ordens_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logs de upload:', error);
        toast({
          title: "Erro ao buscar logs de upload!",
          description: "Ocorreu um problema ao carregar os logs de upload.",
          variant: "destructive",
        });
      }

      if (data) {
        setUploadLogs(data as UploadLog[]);
      }
    } catch (error: any) {
      console.error('Erro inesperado ao buscar logs de upload:', error);
      toast({
        title: "Erro inesperado!",
        description: "Ocorreu um problema inesperado ao carregar os logs de upload.",
        variant: "destructive",
      });
    }
  }, [toast]);

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

  const uploadExcel = async (file: File) => {
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
        created_at: new Date().toISOString(),
      };

      // Use ordens_logs table instead of a custom upload_logs table
      const { error: logError } = await supabase
        .from('ordens_logs')
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

      // Refresh data
      fetchOrdens();
      fetchUploadLogs();
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
  };

  const calculateStats = useCallback(async () => {
    try {
      const { data: allOrdens, error: allOrdensError } = await supabase
        .from('ordens_servico')
        .select('*');

      if (allOrdensError) {
        console.error('Erro ao buscar todas as ordens:', allOrdensError);
        toast({
          title: "Erro ao buscar todas as ordens!",
          description: "Ocorreu um problema ao carregar os dados.",
          variant: "destructive",
        });
        return;
      }

      const totalOrdens = allOrdens.length;

      // Calcula o tempo médio de resolução
      const ordensResolvidas = allOrdens.filter(ordem => ordem.dias !== null);
      const tempoTotalResolucao = ordensResolvidas.reduce((acc, ordem) => acc + (ordem.dias || 0), 0);
      const tempoMedioResolucao = ordensResolvidas.length > 0 ? tempoTotalResolucao / ordensResolvidas.length : 0;

      // Calcula o total por distrito
      const totalPorDistrito: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const distrito = ordem.distrito || 'Desconhecido';
        acc[distrito] = (acc[distrito] || 0) + 1;
        return acc;
      }, {});

      // Calcula o total por classificação
      const totalPorClassificacao: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const classificacao = ordem.classificacao || 'Não Classificado';
        acc[classificacao] = (acc[classificacao] || 0) + 1;
        return acc;
      }, {});

      // Calcula o total por status
      const totalPorStatus: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const status = ordem.status || 'Sem Status';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calcula o total por bairro
      const totalPorBairro: Record<string, number> = allOrdens.reduce((acc: Record<string, number>, ordem) => {
        const bairro = ordem.bairro || 'Não Informado';
        acc[bairro] = (acc[bairro] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalOrdens,
        tempoMedioResolucao,
        totalPorDistrito,
        totalPorClassificacao,
        totalPorStatus,
        totalPorBairro,
      });

    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      toast({
        title: "Erro ao calcular estatísticas!",
        description: "Ocorreu um problema ao calcular as estatísticas.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateChartData = useCallback(() => {
    setChartData(prevChartData => {
      const newChartData = [...prevChartData];

      // Tempo Médio de Resolução
      const tempoMedioResolucaoChart = newChartData.find(chart => chart.id === 'tempo-medio-resolucao');
      if (tempoMedioResolucaoChart && stats) {
        tempoMedioResolucaoChart.data = {
          total: stats.tempoMedioResolucao.toFixed(1),
          details: [
            { label: 'Média', value: stats.tempoMedioResolucao.toFixed(1) },
            { label: 'Mediana', value: '0' }
          ]
        };
      }

      // Ordens por Distrito (Horizontal Bar)
      const ordensPorDistritoChart = newChartData.find(chart => chart.id === 'ordens-por-distrito');
      if (ordensPorDistritoChart && stats) {
        const labels = Object.keys(stats.totalPorDistrito);
        const data = Object.values(stats.totalPorDistrito);
        const backgroundColor = generateColors(labels.length);

        ordensPorDistritoChart.data = {
          datasets: labels.map((label, index) => ({
            label: label,
            data: [data[index]],
            backgroundColor: [backgroundColor[index]],
          }))
        };
      }

      // Ordens por Bairro (Bar)
      const ordensPorBairroChart = newChartData.find(chart => chart.id === 'ordens-por-bairro');
      if (ordensPorBairroChart && stats) {
        const labels = Object.keys(stats.totalPorBairro);
        const data = Object.values(stats.totalPorBairro);
        const backgroundColor = generateColors(labels.length);

        ordensPorBairroChart.data = {
          labels: labels,
          datasets: [{
            label: 'Total',
            data: data,
            backgroundColor: backgroundColor,
          }]
        };
      }

      // Ordens por Classificação (Pie)
      const ordensPorClassificacaoChart = newChartData.find(chart => chart.id === 'ordens-por-classificacao');
      if (ordensPorClassificacaoChart && stats) {
        const labels = Object.keys(stats.totalPorClassificacao);
        const data = Object.values(stats.totalPorClassificacao);
        const backgroundColor = generateColors(labels.length);

        ordensPorClassificacaoChart.data = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
          }]
        };
      }

      // Ordens por Status (Pie)
      const ordensPorStatusChart = newChartData.find(chart => chart.id === 'ordens-por-status');
      if (ordensPorStatusChart && stats) {
        const labels = Object.keys(stats.totalPorStatus);
        const data = Object.values(stats.totalPorStatus);
        const backgroundColor = generateColors(labels.length);

        ordensPorStatusChart.data = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
          }]
        };
      }

      // Ordens Criadas por Mês (Line)
      const ordensCriadasPorMesChart = newChartData.find(chart => chart.id === 'ordens-criadas-por-mes');
      if (ordensCriadasPorMesChart) {
        // Agrupar ordens por mês
        const ordensPorMes = ordens.reduce((acc: Record<string, number>, ordem) => {
          if (ordem.criado_em) {
            const mes = new Date(ordem.criado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            acc[mes] = (acc[mes] || 0) + 1;
          }
          return acc;
        }, {});

        const labels = Object.keys(ordensPorMes).sort();
        const data = labels.map(mes => ordensPorMes[mes]);
        const borderColor = '#4f46e5';
        const backgroundColor = '#c7d2fe';

        ordensCriadasPorMesChart.data = {
          labels: labels,
          datasets: [{
            label: 'Ordens Criadas',
            data: data,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
          }]
        };
      }

      return newChartData;
    });
  }, [stats, ordens]);

  const generateColors = (count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate a HSL color
      const hue = (i * (360 / count)) % 360;
      const saturation = 60;
      const lightness = 60;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  const downloadExcel = async () => {
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
  };

  const downloadUploadedFile = async (publicUrl: string, filename: string) => {
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
  };

  const uploadFile = async (file: File) => {
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
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast({
        title: "Erro ao fazer upload do arquivo!",
        description: "Ocorreu um problema ao enviar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdens();
    fetchUploadLogs();
  }, [fetchOrdens, fetchUploadLogs]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats, ordens]);

  useEffect(() => {
    if (stats) {
      updateChartData();
    }
  }, [stats, updateChartData]);

  return {
    ordens,
    loading,
    uploadLogs,
    chartData,
    setChartData,
    stats,
    filters,
    setFilters,
    fetchOrdens,
    uploadExcel,
    calculateStats,
    downloadExcel,
    downloadUploadedFile,
    uploadFile
  };
};

export default useOrdensServico;
