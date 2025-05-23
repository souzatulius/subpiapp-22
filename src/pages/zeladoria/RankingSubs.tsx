
import React, { useState, useEffect } from 'react';
import { BarChart3, SlidersHorizontal, Printer, FileText, RefreshCw, Bug } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import '@/components/ranking/charts/ChartRegistration';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import RankingContent from '@/components/ranking/RankingContent';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import FeedbackProvider from '@/components/ui/feedback-provider';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { useChartRefresher } from '@/hooks/ranking/useChartRefresher';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useOpenAIChartData } from '@/hooks/ranking/useOpenAIChartData';
import ChartDebugPanel from '@/components/ranking/charts/ChartDebugPanel';
import { toast } from 'sonner';
import UploadSection from '@/components/ranking/UploadSection';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  const { 
    uploadId, 
    setUploadId, 
    planilhaData, 
    setPlanilhaData,
    painelData,
    setPainelData,
    isRefreshing,
    setIsRefreshing,
    isMockData,
    setIsMockData,
    sgzData,
    isLoading,
    setDataSource
  } = useRankingCharts();
  
  const { showFeedback } = useAnimatedFeedback();
  const { sgzProgress, painelProgress, setLastRefreshTime, resetProgress } = useUploadState();
  const { refreshAllChartData } = useChartRefresher();
  const { generateChartData } = useOpenAIChartData();
  
  const handlePrint = () => {
    printWithStyles();
    showFeedback('success', 'Documento enviado para impressão', { duration: 2000 });
  };
  
  const handleExportPDF = () => {
    exportToPDF('Ranking da Zeladoria');
    showFeedback('success', 'PDF gerado com sucesso', { duration: 2000 });
  };
  
  const handleUploadStart = () => {
    setIsUploading(true);
    resetProgress();
    showFeedback('loading', 'Iniciando upload da planilha...', { 
      duration: 0,
      progress: 10,
      stage: 'Preparando upload'
    });
  };

  const handleUploadComplete = async (id: string, data: any[]) => {
    console.log(`SGZ upload complete, ID: ${id}, Records: ${data.length}`);
    
    try {
      // Explicitly set data source to upload
      localStorage.setItem('demo-data-source', 'upload');
      localStorage.setItem('demo-sgz-data', JSON.stringify(data));
      localStorage.setItem('demo-last-update', new Date().toISOString());
      
      setIsMockData(false);
      setDataSource('upload');
      
      setPlanilhaData(data);
      setUploadId(id);
      
      showFeedback('success', `Upload concluído: ${data.length} registros processados`, { 
        duration: 3000 
      });
      
      try {
        const isValid = validateData(data, 'sgz');
        if (!isValid.valid) {
          toast.warning(`Upload realizado, mas com avisos: ${isValid.message}`);
        }
        
        await refreshAllChartData();
        setLastRefreshTime(new Date());
        
        if (data.length > 0) {
          try {
            showFeedback('loading', 'Gerando insights com IA...', { 
              duration: 0,
              progress: 50,
              stage: 'Processando dados'
            });
            
            const chartData = await generateChartData('zeladoria-stats', data);
            console.log('AI-generated chart data:', chartData);
            
            showFeedback('success', 'Insights gerados com sucesso!', { duration: 2000 });
          } catch (aiErr) {
            console.error('Error generating AI insights:', aiErr);
            showFeedback('error', 'Não foi possível gerar os insights com IA', { duration: 3000 });
          }
        }
      } catch (err) {
        console.error("Error refreshing data after upload:", err);
        toast.error("Erro ao processar os dados após o upload");
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error in handleUploadComplete:", error);
      toast.error("Ocorreu um erro ao processar os dados do SGZ");
      setIsUploading(false);
    }
  };

  const handlePainelUploadComplete = async (id: string, data: any[]) => {
    console.log(`Painel upload complete, ID: ${id}, Records: ${data.length}`);
    
    try {
      // Explicitly set data source to upload
      localStorage.setItem('demo-data-source', 'upload');
      localStorage.setItem('demo-painel-data', JSON.stringify(data));
      localStorage.setItem('demo-last-update', new Date().toISOString());
      
      setIsMockData(false);
      setDataSource('upload');
      
      setPainelData(data);
      
      showFeedback('success', `Upload concluído: ${data.length} registros processados`, { 
        duration: 3000 
      });
      
      try {
        const isValid = validateData(data, 'painel');
        if (!isValid.valid) {
          toast.warning(`Upload realizado, mas com avisos: ${isValid.message}`);
        }
        
        await refreshAllChartData();
        setLastRefreshTime(new Date());
        
        if (data.length > 0 && sgzData && sgzData.length > 0) {
          try {
            showFeedback('loading', 'Gerando insights com IA...', { 
              duration: 0,
              progress: 50,
              stage: 'Processando dados'
            });
            
            const comparisonData = [
              { type: 'comparison', sgz: sgzData, painel: data }
            ];
            
            const chartData = await generateChartData('zeladoria-comparison', comparisonData);
            
            console.log('AI-generated comparison chart data:', chartData);
            
            showFeedback('success', 'Insights comparativos gerados com sucesso!', { duration: 2000 });
          } catch (aiErr) {
            console.error('Error generating AI comparison insights:', aiErr);
            showFeedback('error', 'Não foi possível gerar os insights comparativos com IA', { duration: 3000 });
          }
        }
      } catch (err) {
        console.error("Error refreshing data after upload:", err);
        toast.error("Erro ao processar os dados após o upload");
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error in handlePainelUploadComplete:", error);
      toast.error("Ocorreu um erro ao processar os dados do Painel");
      setIsUploading(false);
    }
  };
  
  const validateData = (data: any[], type: 'sgz' | 'painel'): { valid: boolean, message?: string } => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { valid: false, message: "Nenhum dado encontrado para processar" };
    }
    
    let requiredFields: string[] = [];
    if (type === 'sgz') {
      requiredFields = ['ordem_servico', 'sgz_status', 'sgz_tipo_servico'];
    } else {
      requiredFields = ['id_os', 'status', 'tipo_servico'];
    }
    
    const sampleSize = Math.min(10, data.length);
    let missingFields = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const record = data[i];
      for (const field of requiredFields) {
        if (!(field in record) || record[field] === null || record[field] === undefined) {
          missingFields++;
          break;
        }
      }
    }
    
    if (missingFields > sampleSize * 0.3) {
      return { 
        valid: false, 
        message: `Dados podem estar incompletos. Campos obrigatórios ausentes em ${missingFields} registros da amostra.` 
      };
    }
    
    return { valid: true };
  };
  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Attempt to load data from localStorage first for instant rendering
    const tryLoadCachedData = () => {
      try {
        const cachedSgzData = localStorage.getItem('demo-sgz-data');
        const cachedPainelData = localStorage.getItem('demo-painel-data');
        
        if (cachedSgzData) {
          const parsedData = JSON.parse(cachedSgzData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setPlanilhaData(parsedData);
            console.log('Loaded cached SGZ data from localStorage:', parsedData.length, 'records');
          }
        }
        
        if (cachedPainelData) {
          const parsedData = JSON.parse(cachedPainelData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setPainelData(parsedData);
            console.log('Loaded cached Painel data from localStorage:', parsedData.length, 'records');
          }
        }
      } catch (err) {
        console.error('Error loading cached data:', err);
      }
    };

    // Try to load cached data first
    tryLoadCachedData();
    
    // Then refresh data in the background
    refreshAllChartData().catch(err => {
      console.error("Error refreshing chart data on mount:", err);
    });
  }, [refreshAllChartData, setPlanilhaData, setPainelData]);

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      showFeedback('loading', 'Atualizando dados...', { 
        duration: 0,
        progress: 20,
        stage: 'Sincronizando dados'
      });
      
      const dataSource = localStorage.getItem('demo-data-source');
      console.log("Current data source:", dataSource);
      
      // Update mock data status based on data source
      if (dataSource === 'upload' || dataSource === 'supabase') {
        setIsMockData(false);
        setDataSource(dataSource as 'upload' | 'supabase');
      } else if (dataSource === 'mock') {
        setIsMockData(true);
        setDataSource('mock');
      }
      
      await refreshAllChartData();
      
      showFeedback('success', 'Dados atualizados com sucesso', { duration: 2000 });
    } catch (error) {
      console.error("Error refreshing data:", error);
      showFeedback('error', 'Erro ao atualizar dados', { duration: 3000 });
      
      if (!isMockData) {
        console.warn("Supabase failed. Falling back to mock data.");
        localStorage.setItem('demo-data-source', 'mock');
        setIsMockData(true);
        setDataSource('mock');
        
        try {
          await refreshAllChartData();
          showFeedback('warning', 'Usando dados de demonstração (mock)', { duration: 3000 });
        } catch (mockError) {
          console.error("Even mock data failed to load:", mockError);
          showFeedback('error', 'Falha total ao carregar dados', { duration: 3000 });
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        setShowDebugPanel(prev => !prev);
        if (!showDebugPanel) {
          toast.info("Painel de debug ativado");
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDebugPanel]);
  
  useEffect(() => {
    // Synchronize with the local storage data source on component mount
    const dataSource = localStorage.getItem('demo-data-source');
    
    if (dataSource) {
      // Update state based on stored data source
      if (dataSource === 'upload' || dataSource === 'supabase') {
        setIsMockData(false);
        setDataSource(dataSource as 'upload' | 'supabase');
      } else if (dataSource === 'mock') {
        setIsMockData(true);
        setDataSource('mock');
      }
    }
    
    // Log current data source configuration
    console.log("Current data configuration:", {
      dataSource: localStorage.getItem('demo-data-source') || 'unknown',
      lastUpdate: localStorage.getItem('demo-last-update') 
        ? new Date(localStorage.getItem('demo-last-update') as string).toLocaleString() 
        : 'Never',
      isMockData,
      sgzDataLength: sgzData?.length || 0,
      planilhaDataLength: planilhaData?.length || 0,
      painelDataLength: painelData?.length || 0
    });
  }, [setIsMockData, setDataSource, sgzData, planilhaData, painelData, isMockData]);
  
  return (
    <FeedbackProvider>
      <motion.div 
        className="max-w-full mx-auto pdf-content h-full pb-32" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <WelcomeCard 
          title="Ranking da Zeladoria"
          description="Acompanhamento de desempenho e análises de ações, projetos e obras."
          icon={<BarChart3 className="h-6 w-6 mr-2 text-white" />}
          color="bg-gradient-to-r from-blue-700 to-blue-900"
          rightContent={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                onClick={handleRefreshData}
                disabled={isRefreshing || isUploading}
                title="Atualizar Dados"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`bg-white/20 text-white border-white/30 hover:bg-white/30 ${showDebugPanel ? 'bg-white/40' : ''}`}
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  title="Debug Panel"
                >
                  <Bug className="h-5 w-5" />
                </Button>
              )}
            </div>
          }
        />
        
        <Collapsible 
          open={isUploadSectionOpen} 
          onOpenChange={setIsUploadSectionOpen}
          className="mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Upload de Planilhas</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isUploadSectionOpen ? 'Fechar' : 'Expandir'}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-4">
            <UploadSection 
              onUploadStart={handleUploadStart}
              onUploadComplete={handleUploadComplete}
              onPainelUploadComplete={handlePainelUploadComplete}
              isUploading={isUploading}
              user={{}} 
              onRefreshData={handleRefreshData}
            />
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200 rounded-lg"
            onClick={handlePrint}
            title="Imprimir relatório"
          >
            <Printer className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200 rounded-lg"
            onClick={handleExportPDF}
            title="Exportar para PDF"
          >
            <FileText className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200 rounded-lg"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            title="Atualizar dados"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200 rounded-lg"
            onClick={() => setFilterDialogOpen(true)}
            title="Filtrar dados"
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        
        <div className="mt-6">
          <RankingContent 
            filterDialogOpen={filterDialogOpen} 
            setFilterDialogOpen={setFilterDialogOpen} 
            disableCardContainers={true}
            className="mobile-kpi-grid" 
            buttonText="Atualizar"
            lastUpdateText="Atualização"
            onRefreshData={handleRefreshData}
          />
          
          {showDebugPanel && (
            <ChartDebugPanel 
              sgzData={sgzData || planilhaData} 
              painelData={painelData}
              isVisible={showDebugPanel}
              isLoading={isLoading}
              dataSource={isMockData ? 'mock' : (localStorage.getItem('demo-data-source') as 'upload' | 'supabase' | 'mock')}
              dataStatus={{
                sgzCount: sgzData?.length || 0,
                painelCount: painelData?.length || 0,
                lastSgzUpdate: localStorage.getItem('demo-last-update'),
                lastPainelUpdate: localStorage.getItem('demo-last-update'),
                dataSource: localStorage.getItem('demo-data-source') || 'unknown'
              }}
            />
          )}
        </div>

        <style>
          {`
            @media (max-width: 767px) {
              .mobile-kpi-grid .kpi-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
              }
            }
            
            .animate-fade-in {
              animation: fadeIn 0.3s ease-in-out;
            }
            
            @keyframes fadeIn {
              0% {
                opacity: 0;
                transform: translateY(-10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </motion.div>
    </FeedbackProvider>
  );
};

export default RankingSubs;
