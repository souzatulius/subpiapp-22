
import React, { useState } from 'react';
import { BarChart3, SlidersHorizontal, Printer, FileText, Trash2, RefreshCw } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';
// Import our real data provider
import RealDataProvider, { useRealData } from '@/components/ranking/RealDataProvider';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import FeedbackProvider from '@/components/ui/feedback-provider';
import CleanDataDialog from '@/components/ranking/CleanDataDialog';
import { Skeleton } from '@/components/ui/skeleton';
import UploadButton from '@/components/ranking/UploadButton';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cleanDataDialogOpen, setCleanDataDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  
  // Get current user on component mount
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setCurrentUser(data.session.user);
        
        // Check if user is admin
        try {
          const { data: isAdminData } = await supabase.rpc('is_admin', {
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
  };
  
  const handleExportPDF = () => {
    exportToPDF('Ranking da Zeladoria');
  };
  
  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = (id: string, data: any[]) => {
    console.log(`SGZ upload complete, ID: ${id}, Records: ${data.length}`);
    // Don't reset isUploading immediately to allow for background processing
  };

  const handlePainelUploadComplete = (id: string, data: any[]) => {
    console.log(`Painel upload complete, ID: ${id}, Records: ${data.length}`);
    // Don't reset isUploading immediately to allow for background processing
  };
  
  const handleCleanDataSuccess = () => {
    // We'll reload the data in the child component
    setCleanDataDialogOpen(false);
  };
  
  return (
    <FeedbackProvider>
      <RealDataProvider>
        <RankingSubsContent 
          filterDialogOpen={filterDialogOpen}
          setFilterDialogOpen={setFilterDialogOpen}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          handleUploadStart={handleUploadStart}
          handleUploadComplete={handleUploadComplete}
          handlePainelUploadComplete={handlePainelUploadComplete}
          handlePrint={handlePrint}
          handleExportPDF={handleExportPDF}
          currentUser={currentUser}
          isMobile={isMobile}
          isAdmin={isAdmin}
          cleanDataDialogOpen={cleanDataDialogOpen}
          setCleanDataDialogOpen={setCleanDataDialogOpen}
          handleCleanDataSuccess={handleCleanDataSuccess}
          showUploadSection={showUploadSection}
          setShowUploadSection={setShowUploadSection}
        />
      </RealDataProvider>
    </FeedbackProvider>
  );
};

// Separate content component to use the data context
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
  const { refreshData, isLoading, isRefreshing, lastUpdated, formattedLastUpdated } = useRealData();
  
  return (
    <motion.div 
      className="max-w-full mx-auto pdf-content h-full pb-6" 
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
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            onClick={refreshData}
            disabled={isRefreshing || isLoading}
            title="Atualizar Dados"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        }
      />
      
      {/* Last Updated Indicator */}
      {formattedLastUpdated && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <span className="mr-1">Última atualização:</span>
          {isRefreshing ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span className="font-medium">{formattedLastUpdated}</span>
          )}
        </div>
      )}
      
      {/* Action buttons row */}
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
        
        {/* Toggle upload section button */}
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 border-gray-200"
          onClick={() => setShowUploadSection(!showUploadSection)}
        >
          {showUploadSection ? (
            <Trash2 className="h-5 w-5 text-red-600" />
          ) : (
            <UploadButton
              isUploading={isUploading}
              onUploadStart={handleUploadStart}
              onUploadComplete={handleUploadComplete}
              onPainelUploadComplete={handlePainelUploadComplete}
              currentUser={currentUser}
              onRefreshData={refreshData}
            />
          )}
        </Button>
      </div>
      
      {/* Upload section - now shown below the buttons */}
      {showUploadSection && (
        <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Upload de Planilhas</h3>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => setCleanDataDialogOpen(true)}
                disabled={isRefreshing || isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpar Dados
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Planilha SGZ</h4>
              <input
                type="file"
                id="sgzFile"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadStart();
                    handleUploadComplete('mock-id', []);
                  }
                }}
                disabled={isUploading}
              />
              <label htmlFor="sgzFile">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-white text-gray-700 border-gray-300 hover:bg-gray-100 shadow-sm"
                  disabled={isUploading}
                  asChild
                >
                  <span>Selecionar Arquivo SGZ</span>
                </Button>
              </label>
            </div>
            
            <div className="p-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Painel da Zeladoria</h4>
              <input
                type="file"
                id="painelFile"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadStart();
                    handlePainelUploadComplete('mock-id', []);
                  }
                }}
                disabled={isUploading}
              />
              <label htmlFor="painelFile">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-white text-gray-700 border-gray-300 hover:bg-gray-100 shadow-sm"
                  disabled={isUploading}
                  asChild
                >
                  <span>Selecionar Arquivo Painel</span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <RankingContent 
          filterDialogOpen={filterDialogOpen} 
          setFilterDialogOpen={setFilterDialogOpen} 
          disableCardContainers={true}
          className={isMobile ? "mobile-kpi-grid" : ""} 
          buttonText="Filtrar"
          lastUpdateText="Atualização"
        />
      </div>

      {/* Clean Data Dialog */}
      <CleanDataDialog
        isOpen={cleanDataDialogOpen}
        onClose={() => setCleanDataDialogOpen(false)}
        onSuccess={handleCleanDataSuccess}
      />

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
        `}
      </style>
    </motion.div>
  );
};

export default RankingSubs;
