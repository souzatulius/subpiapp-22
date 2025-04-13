import React, { useState, useEffect } from 'react';
import { BarChart3, SlidersHorizontal, Printer, FileText, Trash2, RefreshCw } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import '@/components/ranking/charts/ChartRegistration';
import RealDataProvider, { useRealData } from '@/components/ranking/RealDataProvider';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import FeedbackProvider from '@/components/ui/feedback-provider';
import CleanDataDialog from '@/components/ranking/CleanDataDialog';
import { Skeleton } from '@/components/ui/skeleton';
import UploadButton from '@/components/ranking/UploadButton';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import UploadSection from '@/components/ranking/UploadSection';
import UploadProgressDisplay from '@/components/ranking/UploadProgressDisplay';
const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cleanDataDialogOpen, setCleanDataDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const {
    showFeedback
  } = useAnimatedFeedback();
  const {
    resetProgress
  } = useUploadState();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setCurrentUser(data.session.user);
        try {
          const {
            data: isAdminData
          } = await supabase.rpc('is_admin', {
            user_id: data.session.user.id
          });
          setIsAdmin(Boolean(isAdminData));
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        console.log('No authenticated user found');
      }
    };
    fetchUser();
  }, []);
  const handlePrint = () => {
    printWithStyles();
    showFeedback('success', 'Documento enviado para impressão', {
      duration: 2000
    });
  };
  const handleExportPDF = () => {
    exportToPDF('Ranking da Zeladoria');
    showFeedback('success', 'PDF gerado com sucesso', {
      duration: 2000
    });
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
  const handleUploadComplete = (id: string, data: any[]) => {
    console.log(`SGZ upload complete, ID: ${id}, Records: ${data.length}`);
    showFeedback('success', `Upload concluído: ${data.length} registros processados`, {
      duration: 3000
    });
    setTimeout(() => setIsUploading(false), 1500);
  };
  const handlePainelUploadComplete = (id: string, data: any[]) => {
    console.log(`Painel upload complete, ID: ${id}, Records: ${data.length}`);
    showFeedback('success', `Upload concluído: ${data.length} registros processados`, {
      duration: 3000
    });
    setTimeout(() => setIsUploading(false), 1500);
  };
  const handleCleanDataSuccess = () => {
    setCleanDataDialogOpen(false);
    showFeedback('success', 'Dados limpos com sucesso', {
      duration: 2000
    });
  };
  return <FeedbackProvider>
      <RealDataProvider>
        <RankingSubsContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} isUploading={isUploading} setIsUploading={setIsUploading} handleUploadStart={handleUploadStart} handleUploadComplete={handleUploadComplete} handlePainelUploadComplete={handlePainelUploadComplete} handlePrint={handlePrint} handleExportPDF={handleExportPDF} currentUser={currentUser} isMobile={isMobile} isAdmin={isAdmin} cleanDataDialogOpen={cleanDataDialogOpen} setCleanDataDialogOpen={setCleanDataDialogOpen} handleCleanDataSuccess={handleCleanDataSuccess} showUploadSection={showUploadSection} setShowUploadSection={setShowUploadSection} />
      </RealDataProvider>
    </FeedbackProvider>;
};
const RankingSubsContent = ({
  filterDialogOpen,
  setFilterDialogOpen,
  isUploading,
  setIsUploading,
  handleUploadStart,
  handleUploadComplete,
  handlePainelUploadComplete,
  handlePrint,
  handleExportPDF,
  currentUser,
  isMobile,
  isAdmin,
  cleanDataDialogOpen,
  setCleanDataDialogOpen,
  handleCleanDataSuccess,
  showUploadSection,
  setShowUploadSection
}) => {
  const {
    refreshData,
    isLoading,
    isRefreshing,
    lastUpdated,
    formattedLastUpdated
  } = useRealData();
  const {
    sgzProgress,
    painelProgress
  } = useUploadState();
  const {
    showFeedback,
    updateFeedbackProgress
  } = useAnimatedFeedback();
  const hasActiveUploads = sgzProgress && (sgzProgress.stage === 'uploading' || sgzProgress.stage === 'processing') || painelProgress && (painelProgress.stage === 'uploading' || painelProgress.stage === 'processing');
  const handleRefreshData = async () => {
    showFeedback('loading', 'Atualizando dados...', {
      duration: 0,
      progress: 10,
      stage: 'Iniciando atualização'
    });
    try {
      await refreshData();
      updateFeedbackProgress(100, 'Dados atualizados com sucesso');
      setTimeout(() => {
        showFeedback('success', 'Dados atualizados com sucesso', {
          duration: 2000
        });
      }, 500);
    } catch (error) {
      showFeedback('error', 'Erro ao atualizar dados', {
        duration: 3000
      });
    }
  };
  return <motion.div className="max-w-full mx-auto pdf-content h-full pb-6" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      <WelcomeCard title="Ranking da Zeladoria" description="Acompanhamento de desempenho e análises de ações, projetos e obras." icon={<BarChart3 className="h-6 w-6 mr-2 text-gray-600" />} color="bg-gradient-to-r from-orange-500 to-orange-700" rightContent={<Button variant="outline" size="icon" className="bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={handleRefreshData} disabled={isRefreshing || isLoading || isUploading} title="Atualizar Dados">
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>} />
      
      {formattedLastUpdated && <div className="mt-2 text-xs text-gray-500 flex items-center">
          <span className="mr-1">Última atualização:</span>
          {isRefreshing ? <Skeleton className="h-4 w-32" /> : <span className="font-medium">{formattedLastUpdated}</span>}
        </div>}
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" size="icon" className="bg-white hover:bg-gray-100 border-gray-200" onClick={handlePrint} disabled={isUploading}>
          <Printer className="h-5 w-5 text-gray-600" />
        </Button>
        
        <Button variant="outline" size="icon" className="bg-white hover:bg-gray-100 border-gray-200" onClick={handleExportPDF} disabled={isUploading}>
          <FileText className="h-5 w-5 text-gray-600" />
        </Button>
        
        <Button variant="outline" size="icon" className="bg-white hover:bg-gray-100 border-gray-200" onClick={() => setFilterDialogOpen(true)} disabled={isUploading}>
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        </Button>
        
        <motion.div whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }}>
          <Button variant={hasActiveUploads ? "default" : "outline"} size="icon" className={hasActiveUploads ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-white hover:bg-gray-100 border-gray-200"} onClick={() => setShowUploadSection(!showUploadSection)} disabled={isUploading && !hasActiveUploads}>
            <UploadButton isUploading={isUploading} onUploadStart={handleUploadStart} onUploadComplete={handleUploadComplete} onPainelUploadComplete={handlePainelUploadComplete} currentUser={currentUser} onRefreshData={refreshData} />
          </Button>
        </motion.div>
      </div>
      
      {(sgzProgress || painelProgress) && <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Importação em Andamento</h3>
          
          {sgzProgress && <div className="mb-3">
              <UploadProgressDisplay stats={sgzProgress} type="sgz" />
            </div>}
          
          {painelProgress && <div>
              <UploadProgressDisplay stats={painelProgress} type="painel" />
            </div>}
        </div>}
      
      <AnimatePresence>
        {showUploadSection && !hasActiveUploads && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.3
      }} className="mt-4">
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Upload de Planilhas</h3>
                {isAdmin && <Button variant="outline" size="sm" className="bg-orange-500 text-white hover:bg-orange-600" onClick={() => setCleanDataDialogOpen(true)} disabled={isRefreshing || isLoading}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Limpar Dados
                  </Button>}
              </div>
              
              <UploadSection onUploadStart={handleUploadStart} onUploadComplete={handleUploadComplete} onPainelUploadComplete={handlePainelUploadComplete} isUploading={isUploading} user={currentUser} onRefreshData={refreshData} />
            </div>
          </motion.div>}
      </AnimatePresence>
      
      <div className="mt-6">
        <RankingContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} disableCardContainers={true} className={isMobile ? "mobile-kpi-grid" : ""} buttonText="Filtrar" lastUpdateText="Atualização" />
      </div>

      <CleanDataDialog isOpen={cleanDataDialogOpen} onClose={() => setCleanDataDialogOpen(false)} onSuccess={handleCleanDataSuccess} />

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
    </motion.div>;
};
export default RankingSubs;