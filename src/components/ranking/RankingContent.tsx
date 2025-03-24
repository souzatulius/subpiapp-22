
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
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
  const [activeTab, setActiveTab] = useState<string>('dados');
  const [visibleCharts, setVisibleCharts] = useState<ChartCard[]>([]);
  const [chartConfig, setChartConfig] = useState<any>(null);
  const [lastUpdatedFormatted, setLastUpdatedFormatted] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  
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
  } = useRankingData(user, setUploadProgress);

  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange,
    saveUserPreferences
  } = useFilterManagement();

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

  useEffect(() => {
    if (uploadProgress > 0 && uploadProgress < 100) {
      const remainingPercentage = 100 - uploadProgress;
      const estimatedSeconds = remainingPercentage * 0.5;
      
      if (estimatedSeconds > 60) {
        const minutes = Math.floor(estimatedSeconds / 60);
        const seconds = Math.floor(estimatedSeconds % 60);
        setEstimatedTime(`~${minutes}m ${seconds}s restantes`);
      } else {
        setEstimatedTime(`~${Math.ceil(estimatedSeconds)}s restantes`);
      }
    } else if (uploadProgress >= 100) {
      setEstimatedTime(null);
    }
  }, [uploadProgress]);

  useEffect(() => {
    loadChartConfig();
  }, [user]);

  const loadChartConfig = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('cards_config')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        if (error.code !== 'PGRST116') {
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

  const saveChartConfig = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar configurações.");
      return;
    }
    
    setIsSavingConfig(true);
    
    try {
      const config = {
        charts: visibleCharts,
        chartVisibility,
        lastUpdated: new Date().toISOString()
      };
      
      await saveUserPreferences({
        filters,
        chartVisibility
      });
      
      const { error } = await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving chart config:', error);
        toast.error("Não foi possível salvar a configuração dos gráficos.");
        return;
      }
      
      setChartConfig(config);
      toast.success("Configuração salva com sucesso.");
    } catch (err) {
      console.error('Failed to save chart config:', err);
      toast.error("Ocorreu um erro ao salvar a configuração.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setVisibleCharts((charts) => {
        const oldIndex = charts.findIndex((c) => c.id === active.id);
        const newIndex = charts.findIndex((c) => c.id === over.id);
        
        const newCharts = [...charts];
        const [movedItem] = newCharts.splice(oldIndex, 1);
        newCharts.splice(newIndex, 0, movedItem);
        
        return newCharts.map((chart, idx) => ({
          ...chart,
          order: idx
        }));
      });
    }
  };

  const toggleChartVisibility = (chartId: string) => {
    setVisibleCharts((charts) => 
      charts.map((chart) => 
        chart.id === chartId 
          ? { ...chart, visible: !chart.visible } 
          : chart
      )
    );
  };

  const handleUpload = async (file: File) => {
    try {
      setUploadProgress(0);
      setEstimatedTime('Calculando...');
      
      toast.info("Processando planilha", {
        description: "Aguarde enquanto processamos os dados..."
      });
      
      await handleFileUpload(file);
      
      toast.success("Upload concluído!", {
        description: "Os gráficos foram atualizados com sucesso."
      });
      
      saveChartConfig();
      
    } catch (error: any) {
      toast.error("Erro no upload", {
        description: error.message || "Houve um erro ao processar a planilha."
      });
    } finally {
      setUploadProgress(0);
      setEstimatedTime(null);
    }
  };

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

  const handleApplyFilters = () => {
    applyFilters(filters);
    toast.success("Filtros aplicados", {
      description: "Os gráficos foram atualizados com os filtros selecionados."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ranking das Subs - Zeladoria</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dados">Upload de Dados</TabsTrigger>
            <TabsTrigger value="filtros">Filtros</TabsTrigger>
            <TabsTrigger value="graficos">Visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="pt-2">
            <UploadSection
              onUpload={handleUpload}
              lastUpload={lastUpload ? {
                id: lastUpload.id,
                fileName: lastUpload.arquivo_nome,
                uploadDate: lastUpload.data_upload
              } : null}
              onDelete={deleteLastUpload}
              isLoading={isLoading}
              onRefresh={fetchLastUpload}
              uploadProgress={uploadProgress}
              estimatedTime={estimatedTime}
            />
          </TabsContent>
          
          <TabsContent value="filtros" className="pt-2">
            <FilterSection
              filters={filters}
              onFiltersChange={handleFiltersChange}
              companies={companies}
              districts={districts}
              serviceTypes={serviceTypes}
              statuses={statusTypes}
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
              isProcessing={isLoading || isSavingConfig}
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
