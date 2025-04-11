
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import RankingContent from '@/components/ranking/RankingContent';
import { BarChart3, SlidersHorizontal, Printer, FileText } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';
// Import the demo data provider
import DemoDataProvider from '@/components/ranking/DemoDataProvider';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadSection from '@/components/ranking/UploadSection';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import FeedbackProvider from '@/components/ui/feedback-provider';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import UploadProgressDisplay from '@/components/ranking/UploadProgressDisplay';

const RankingSubs = () => {
  // Start with sidebar collapsed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    uploadId, 
    setUploadId, 
    planilhaData, 
    setPlanilhaData,
    painelData,
    setPainelData,
    refreshChartData
  } = useRankingCharts();
  
  const { showFeedback } = useAnimatedFeedback();
  const { sgzProgress, painelProgress, setLastRefreshTime } = useUploadState();
  
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
    
    showFeedback('success', `Upload concluído: ${data.length} registros processados`, { 
      duration: 3000 
    });
    
    // Refresh data after upload
    try {
      await refreshChartData();
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error("Error refreshing data after upload:", err);
    }
  };

  const handlePainelUploadComplete = async (id: string, data: any[]) => {
    console.log(`Painel upload complete, ID: ${id}, Records: ${data.length}`);
    setPainelData(data);
    setIsUploading(false);
    
    showFeedback('success', `Upload concluído: ${data.length} registros processados`, { 
      duration: 3000 
    });
    
    // Refresh data after upload
    try {
      await refreshChartData();
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error("Error refreshing data after upload:", err);
    }
  };
  
  const [isUploading, setIsUploading] = useState(false);

  // Refresh data when component mounts
  useEffect(() => {
    refreshChartData().catch(err => {
      console.error("Error refreshing chart data on mount:", err);
    });
  }, [refreshChartData]);

  // Handle refresh with visual feedback
  const handleRefreshData = async () => {
    showFeedback('loading', 'Atualizando dados...', {
      duration: 0,
      progress: 20,
      stage: 'Buscando dados mais recentes'
    });
    
    try {
      await refreshChartData();
      setLastRefreshTime(new Date());
      showFeedback('success', 'Dados atualizados com sucesso', { duration: 2000 });
    } catch (error) {
      console.error("Error refreshing data:", error);
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
        />
        
        {/* Upload Section - Restored */}
        <div className="mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Upload de Planilhas</h2>
          <UploadSection 
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onPainelUploadComplete={handlePainelUploadComplete}
            isUploading={isUploading}
            user={{}} // Pass user info here when authentication is implemented
            onRefreshData={handleRefreshData}
          />
          
          {/* Show progress indicators when uploads are active */}
          {(sgzProgress || painelProgress) && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 animate-fade-in">
              <h3 className="text-sm font-medium mb-3">Importação em Andamento</h3>
              
              {sgzProgress && (
                <div className="mb-3">
                  <UploadProgressDisplay stats={sgzProgress} type="sgz" />
                </div>
              )}
              
              {painelProgress && (
                <div>
                  <UploadProgressDisplay stats={painelProgress} type="painel" />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200"
            onClick={handlePrint}
          >
            <Printer className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200"
            onClick={handleExportPDF}
          >
            <FileText className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-100 border-gray-200"
            onClick={() => setFilterDialogOpen(true)}
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-100 border-gray-200"
            onClick={handleRefreshData}
          >
            Atualizar
          </Button>
        </div>
        
        <div className="mt-6">
          <DemoDataProvider>
            <RankingContent 
              filterDialogOpen={filterDialogOpen} 
              setFilterDialogOpen={setFilterDialogOpen} 
              disableCardContainers={true}
              className={isMobile ? "mobile-kpi-grid" : ""} 
              buttonText="Atualizar"
              lastUpdateText="Atualização"
              onRefreshData={handleRefreshData}
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

export default RankingSubs;
