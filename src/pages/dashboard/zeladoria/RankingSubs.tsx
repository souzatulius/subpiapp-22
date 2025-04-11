
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
import UploadSection from '@/components/ranking/UploadSection';
import { supabase } from '@/integrations/supabase/client';
import FeedbackProvider from '@/components/ui/feedback-provider';
import CleanDataDialog from '@/components/ranking/CleanDataDialog';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cleanDataDialogOpen, setCleanDataDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Get current user on component mount
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setCurrentUser(data.session.user);
        
        // Check if user is admin
        const { data: isAdminData } = await supabase.rpc('is_admin', {
          user_id: data.session.user.id
        });
        
        setIsAdmin(Boolean(isAdminData));
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
    setIsUploading(false);
  };

  const handlePainelUploadComplete = (id: string, data: any[]) => {
    console.log(`Painel upload complete, ID: ${id}, Records: ${data.length}`);
    setIsUploading(false);
  };
  
  const handleCleanDataSuccess = () => {
    // We'll reload the data in the child component
  };
  
  return (
    <FeedbackProvider>
      <RealDataProvider>
        <RankingSubsContent 
          filterDialogOpen={filterDialogOpen}
          setFilterDialogOpen={setFilterDialogOpen}
          isUploading={isUploading}
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
  handleCleanDataSuccess
}) => {
  const { refreshData } = useRealData();
  
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
      />
      
      {/* Upload Section */}
      <div className="mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Upload de Planilhas</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              onClick={refreshData}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar Dados
            </Button>
            
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                onClick={() => setCleanDataDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpar Dados
              </Button>
            )}
          </div>
        </div>
        
        <UploadSection 
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
          onPainelUploadComplete={handlePainelUploadComplete}
          isUploading={isUploading}
          user={currentUser}
          onRefreshData={refreshData}
        />
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
      </div>
      
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
