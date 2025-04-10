
import React, { useState } from 'react';
import { BarChart3, SlidersHorizontal, Printer, FileText } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';
// Import the demo data provider
import DemoDataProvider from '@/components/ranking/DemoDataProvider';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadSection from '@/components/ranking/UploadSection';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    uploadId, 
    setUploadId, 
    planilhaData, 
    setPlanilhaData,
    painelData,
    setPainelData
  } = useRankingCharts();
  
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
    setIsUploading(false);
    setPlanilhaData(data);
    setUploadId(id);
  };

  const handlePainelUploadComplete = (id: string, data: any[]) => {
    setIsUploading(false);
    setPainelData(data);
  };
  
  return (
    <motion.div 
      className="max-w-full mx-auto pdf-content h-full" 
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
        <DemoDataProvider>
          <RankingContent 
            filterDialogOpen={filterDialogOpen} 
            setFilterDialogOpen={setFilterDialogOpen} 
            disableCardContainers={true}
            className={isMobile ? "mobile-kpi-grid" : ""} 
            buttonText="Atualizar"
            lastUpdateText="Atualização"
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
        `}
      </style>
    </motion.div>
  );
};

export default RankingSubs;
