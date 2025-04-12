
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import RankingContent from '@/components/ranking/RankingContent';
import { BarChart3, SlidersHorizontal, Printer, FileText, RefreshCw, Bug } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';
// Import the demo data provider
import DemoDataProvider, { useDemoData } from '@/components/ranking/DemoDataProvider';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadSection from '@/components/ranking/UploadSection';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import FeedbackProvider from '@/components/ui/feedback-provider';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { useChartRefresher } from '@/hooks/ranking/useChartRefresher';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useOpenAIChartData } from '@/hooks/ranking/useOpenAIChartData';
import ChartDebugPanel from '@/components/ranking/charts/ChartDebugPanel';

const RankingSubs = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    uploadId, 
    setUploadId, 
    planilhaData, 
    setPlanilhaData,
    painelData,
    setPainelData,
  } = useRankingCharts();
  
  const { showFeedback } = useAnimatedFeedback();
  const { sgzProgress, painelProgress, setLastRefreshTime, resetProgress } = useUploadState();
  const { refreshAllChartData, isRefreshing } = useChartRefresher();
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
    resetProgress(); // Reset any previous upload progress
    showFeedback('loading', 'Iniciando upload da planilha...', { 
      duration: 0,
      progress: 10,
      stage: 'Preparando upload'
    });
  };

  const handleUploadComplete = async (id: string, data: any[]) => {
    console.log(`SGZ upload complete, ID: ${id}, Records: ${data.length}`);
    setPlanilhaData(data);
    setUploadId(id);
    setIsUploading(false);
    
    // Show success feedback with longer duration
    showFeedback('success', `Upload concluído: ${data.length} registros processados`, { 
      duration: 3000 
    });
    
    // Refresh data after upload
    try {
      await refreshAllChartData();
      setLastRefreshTime(new Date());
      
      // Generate chart data using OpenAI
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
    }
  };

  const handlePainelUploadComplete = async (id: string, data: any[]) => {
    console.log(`Painel upload complete, ID: ${id}, Records: ${data.length}`);
    setPainelData(data);
    setIsUploading(false);
    
    // Show success feedback with longer duration
    showFeedback('success', `Upload concluído: ${data.length} registros processados`, { 
      duration: 3000 
    });
    
    // Refresh data after upload
    try {
      await refreshAllChartData();
      setLastRefreshTime(new Date());
      
      // Generate chart data using OpenAI
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
    }
  };
  
  const [isUploading, setIsUploading] = useState(false);

  // Refresh data when component mounts
  useEffect(() => {
    refreshAllChartData().catch(err => {
      console.error("Error refreshing chart data on mount:", err);
    });
  }, [refreshAllChartData]);

  // Handle refresh with visual feedback
  const handleRefreshData = async () => {
    try {
      await refreshAllChartData();
      // Show success feedback after refresh
      showFeedback('success', 'Dados atualizados com sucesso', { duration: 2000 });
    } catch (error) {
      console.error("Error refreshing data:", error);
      // Show error feedback
      showFeedback('error', 'Erro ao atualizar dados', { duration: 3000 });
    }
  };
  
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
          color="bg-gradient-to-r from-orange-500 to-orange-700"
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
        
        {/* Upload Section in Collapsible */}
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
              user={{}} // Pass user info here when authentication is implemented
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
          >
            <Printer className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200 rounded-lg"
            onClick={handleExportPDF}
          >
            <FileText className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200 rounded-lg"
            onClick={() => setFilterDialogOpen(true)}
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        
        <div className="mt-6">
          <DemoDataProvider>
            <RankingContentWithDebug 
              filterDialogOpen={filterDialogOpen} 
              setFilterDialogOpen={setFilterDialogOpen} 
              disableCardContainers={true}
              className={isMobile ? "mobile-kpi-grid" : ""} 
              buttonText="Atualizar"
              lastUpdateText="Atualização"
              onRefreshData={handleRefreshData}
              showDebugPanel={showDebugPanel}
            />
          </DemoDataProvider>
        </div>

        {/* Add CSS for mobile KPI grid */}
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

// Separate child component to use the demo data context
const RankingContentWithDebug = ({ 
  showDebugPanel, 
  filterDialogOpen,
  setFilterDialogOpen,
  disableCardContainers,
  className,
  buttonText,
  lastUpdateText,
  onRefreshData
}) => {
  const { sgzData, painelData, isLoading, refreshData, updateMockData } = useDemoData();
  
  return (
    <>
      <RankingContent 
        filterDialogOpen={filterDialogOpen}
        setFilterDialogOpen={setFilterDialogOpen}
        disableCardContainers={disableCardContainers}
        className={className}
        buttonText={buttonText}
        lastUpdateText={lastUpdateText}
        onRefreshData={onRefreshData}
      />
      
      {showDebugPanel && (
        <ChartDebugPanel 
          sgzData={sgzData}
          painelData={painelData}
          isVisible={showDebugPanel}
          isLoading={isLoading}
          onUpdateMockData={updateMockData}
        />
      )}
    </>
  );
};

export default RankingSubs;
