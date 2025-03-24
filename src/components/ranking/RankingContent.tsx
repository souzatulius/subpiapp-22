
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { supabase } from '@/integrations/supabase/client';

import UploadSection from './UploadSection';
import FilterSection from './FilterSection';
import ChartsSection from './ChartsSection';
import { useRankingData } from '@/hooks/ranking/useRankingData';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { ChartCard } from './types';

const RankingContent: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('dados');
  const [visibleCharts, setVisibleCharts] = useState<ChartCard[]>([]);
  const [chartConfig, setChartConfig] = useState<any>(null);
  const [lastUpdatedFormatted, setLastUpdatedFormatted] = useState<string | null>(null);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const {
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
  } = useRankingData(user);

  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  } = useFilterManagement();

  // Format the last updated date and time
  useEffect(() => {
    if (lastUpload) {
      const date = new Date(lastUpload.data_upload);
      const formattedDate = date.toLocaleDateString('pt-BR');
      const formattedTime = date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setLastUpdatedFormatted(`${formattedDate} às ${formattedTime}`);
    } else {
      setLastUpdatedFormatted(null);
    }
  }, [lastUpload]);

  // Initialize charts when data is loaded
  useEffect(() => {
    if (chartData && !isLoading) {
      // Here we would load the saved chart configuration from Supabase
      // For now, we'll use a default configuration
      const defaultCharts: ChartCard[] = [
        { id: 'status-distribution', name: 'Distribuição de Status', visible: true, order: 0 },
        { id: 'resolution-time', name: 'Tempo de Resolução', visible: true, order: 1 },
        { id: 'companies-performance', name: 'Desempenho por Empresa', visible: true, order: 2 },
        { id: 'daily-orders', name: 'Novas Ordens Diárias', visible: true, order: 3 },
        { id: 'time-to-close', name: 'Tempo até Fechamento', visible: true, order: 4 },
        { id: 'efficiency-score', name: 'Pontuação de Eficiência', visible: true, order: 5 },
      ];
      
      setVisibleCharts(defaultCharts);
      loadChartConfig();
    }
  }, [chartData, isLoading]);

  // Load saved chart configuration from Supabase
  const loadChartConfig = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('cards_config')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error('Error loading chart config:', error);
        }
        return;
      }
      
      if (data && data.cards_config) {
        try {
          const config = typeof data.cards_config === 'string' 
            ? JSON.parse(data.cards_config) 
            : data.cards_config;
          
          setChartConfig(config);
          
          if (config.charts && Array.isArray(config.charts)) {
            setVisibleCharts(config.charts);
          }
          
          if (config.chartVisibility) {
            handleChartVisibilityChange(config.chartVisibility);
          }
        } catch (e) {
          console.error('Error parsing chart config:', e);
        }
      }
    } catch (err) {
      console.error('Failed to load chart config:', err);
    }
  };

  // Save chart configuration to Supabase
  const saveChartConfig = async () => {
    if (!user) return;
    
    try {
      const config = {
        charts: visibleCharts,
        chartVisibility,
        lastUpdated: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error('Error saving chart config:', error);
        toast({
          title: "Erro ao salvar configuração",
          description: "Não foi possível salvar a configuração dos gráficos.",
          variant: "destructive"
        });
        return;
      }
      
      setChartConfig(config);
      toast({
        title: "Configuração salva",
        description: "A configuração dos gráficos foi salva com sucesso.",
      });
    } catch (err) {
      console.error('Failed to save chart config:', err);
      toast({
        title: "Erro ao salvar configuração",
        description: "Ocorreu um erro ao salvar a configuração.",
        variant: "destructive"
      });
    }
  };

  // Handle chart reordering via drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setVisibleCharts((charts) => {
        const oldIndex = charts.findIndex((c) => c.id === active.id);
        const newIndex = charts.findIndex((c) => c.id === over.id);
        
        const newCharts = [...charts];
        const [movedItem] = newCharts.splice(oldIndex, 1);
        newCharts.splice(newIndex, 0, movedItem);
        
        // Update order property
        return newCharts.map((chart, idx) => ({
          ...chart,
          order: idx
        }));
      });
    }
  };

  // Toggle chart visibility
  const toggleChartVisibility = (chartId: string) => {
    setVisibleCharts((charts) => 
      charts.map((chart) => 
        chart.id === chartId 
          ? { ...chart, visible: !chart.visible } 
          : chart
      )
    );
  };

  // Handle file upload with success/error toasts
  const handleUpload = async (file: File) => {
    try {
      toast({
        title: "Processando planilha",
        description: "Aguarde enquanto processamos os dados...",
      });
      
      await handleFileUpload(file);
      
      toast({
        title: "Upload concluído!",
        description: "Os gráficos foram atualizados com sucesso.",
      });
      
      // Auto-save chart config after successful upload
      saveChartConfig();
      
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Houve um erro ao processar a planilha.",
        variant: "destructive"
      });
    }
  };

  // Remove a specific filter
  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case 'status':
        handleFiltersChange({
          statuses: filters.statuses.filter(s => s !== value)
        });
        break;
      case 'district':
        handleFiltersChange({
          districts: filters.districts.filter(d => d !== value)
        });
        break;
      case 'serviceType':
        handleFiltersChange({
          serviceTypes: filters.serviceTypes.filter(s => s !== value)
        });
        break;
      case 'dateRange':
        handleFiltersChange({ dateRange: undefined });
        break;
    }
  };

  // Handle applying filters with feedback
  const handleApplyFilters = () => {
    applyFilters(filters);
    toast({
      title: "Filtros aplicados",
      description: "Os gráficos foram atualizados com os filtros selecionados.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Análise das Ordens de Serviço</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dados">Upload de Dados</TabsTrigger>
            <TabsTrigger value="filtros">Filtros</TabsTrigger>
            <TabsTrigger value="graficos">Visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="pt-2">
            <UploadSection
              onUpload={handleUpload}
              lastUpload={lastUpload}
              onDelete={deleteLastUpload}
              isLoading={isLoading}
              onRefresh={fetchLastUpload}
            />
          </TabsContent>
          
          <TabsContent value="filtros" className="pt-2">
            <FilterSection
              filters={filters}
              onFiltersChange={handleFiltersChange}
              companies={companies}
              districts={districts as any[]}
              serviceTypes={serviceTypes}
              statuses={statusTypes as any[]}
              onRemoveFilter={handleRemoveFilter}
              onApplyFilters={handleApplyFilters}
              onClearFilters={() => {
                handleFiltersChange({
                  statuses: ['Todos'],
                  districts: ['Todos'],
                  serviceTypes: ['Todos'],
                  dateRange: undefined
                });
              }}
              onSaveChartConfig={saveChartConfig}
              lastUpdated={lastUpdatedFormatted}
              isProcessing={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="graficos" className="pt-2">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={visibleCharts.map(chart => chart.id)}
                strategy={verticalListSortingStrategy}
              >
                <ChartsSection
                  chartData={chartData}
                  isLoading={isLoading}
                  chartVisibility={chartVisibility}
                  visibleCharts={visibleCharts}
                  onToggleVisibility={toggleChartVisibility}
                  lastUpdated={lastUpdatedFormatted}
                />
              </SortableContext>
            </DndContext>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RankingContent;
