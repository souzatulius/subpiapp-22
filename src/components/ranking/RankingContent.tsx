
import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import ActionsSection from './ActionsSection';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { DateRange } from 'react-day-picker';

export type OrderStatus = 'Planejar' | 'Novo' | 'Aprovado' | 'Concluído' | 'Todos';
export type ServiceType = 'Tapa Buraco' | 'Poda' | 'Limpeza' | 'Todos';
export type District = 'Itaim Bibi' | 'Pinheiros' | 'Alto de Pinheiros' | 'Jardim Paulista' | 'Todos';

export interface ChartVisibility {
  occurrences: boolean;
  resolutionTime: boolean;
  serviceTypes: boolean;
  neighborhoods: boolean;
  frequentServices: boolean;
  statusDistribution: boolean;
}

export interface FilterOptions {
  dateRange: DateRange | undefined;
  statuses: OrderStatus[];
  serviceTypes: ServiceType[];
  districts: District[];
}

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
}

const RankingContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  
  // Estado para controle de visibilidade dos gráficos
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    occurrences: true,
    resolutionTime: true,
    serviceTypes: true,
    neighborhoods: true,
    frequentServices: true,
    statusDistribution: true
  });
  
  // Estado para filtros
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    statuses: ['Todos'],
    serviceTypes: ['Todos'],
    districts: ['Todos']
  });

  // Dados de exemplo para os gráficos (serão substituídos pelos dados do banco)
  const sampleData = {
    occurrences: {
      labels: ['Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Número de Ocorrências',
          data: [320, 280, 190, 250],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    },
    serviceTypes: {
      labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Manutenção'],
      datasets: [
        {
          label: 'Pinheiros',
          data: [150, 120, 200, 80],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Outros Distritos',
          data: [200, 150, 300, 120],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    },
    resolutionTime: {
      labels: ['Geral', 'Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [12, 10, 15, 8, 14],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ],
    },
    neighborhoods: {
      labels: ['Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Ocorrências',
          data: [320, 280, 190, 250],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
          borderWidth: 1,
        },
      ],
    },
    frequentServices: {
      labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Manutenção', 'Iluminação'],
      datasets: [
        {
          label: 'Itaim Bibi',
          data: [65, 45, 30, 25, 20],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Pinheiros',
          data: [55, 50, 40, 30, 15],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Alto de Pinheiros',
          data: [40, 30, 35, 20, 10],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
        {
          label: 'Jardim Paulista',
          data: [60, 40, 25, 35, 25],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    },
    statusDistribution: {
      labels: ['Planejar', 'Novo', 'Aprovado', 'Em execução', 'Concluído'],
      datasets: [
        {
          label: 'Geral',
          data: [15, 25, 20, 10, 30],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Pinheiros',
          data: [10, 20, 25, 15, 30],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    },
  };

  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user]);

  useEffect(() => {
    // Em uma versão real, atualizariamos baseado nos filtros
    // Por enquanto, apenas usamos os dados de exemplo
    setChartData(sampleData);
    setIsLoading(false);
  }, [filters]);

  const fetchLastUpload = async () => {
    try {
      const { data, error } = await supabase
        .from('ranking_uploads')
        .select('*')
        .eq('usuario_id', user?.id)
        .order('data_upload', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          fileName: data[0].nome_arquivo,
          uploadDate: new Date(data[0].data_upload).toLocaleString()
        });
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
  };

  const handleUpload = async (file: File) => {
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

      // 1. Salvar referência ao upload no banco de dados
      const { data, error } = await supabase
        .from('ranking_uploads')
        .insert({
          usuario_id: user.id,
          nome_arquivo: file.name,
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Na versão real, aqui processaríamos o arquivo
        // Por enquanto, apenas atualizamos a interface
        setLastUpload({
          id: data[0].id,
          fileName: data[0].nome_arquivo,
          uploadDate: new Date(data[0].data_upload).toLocaleString()
        });

        toast({
          title: "Upload concluído",
          description: "A planilha foi carregada com sucesso.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleChartVisibilityChange = (newVisibility: Partial<ChartVisibility>) => {
    setChartVisibility(prev => ({ ...prev, ...newVisibility }));
  };

  const handleDeleteUpload = async () => {
    if (!lastUpload || !user) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('ranking_uploads')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      setLastUpload(null);
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ranking das Subs</h1>
      
      <UploadSection 
        onUpload={handleUpload} 
        lastUpload={lastUpload} 
        onDelete={handleDeleteUpload}
        isLoading={isLoading}
      />
      
      <FilterSection 
        filters={filters} 
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
      />
      
      <ChartsSection 
        chartData={chartData} 
        isLoading={isLoading}
        chartVisibility={chartVisibility}
      />
      
      <ActionsSection />
    </div>
  );
};

export default RankingContent;
