
import React, { useState } from 'react';
import { BarChart3, SlidersHorizontal, Printer, FileText, RefreshCw } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import '@/components/ranking/charts/ChartRegistration';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import RankingContent from '@/components/ranking/RankingContent';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handlePrint = () => {
    printWithStyles();
  };

  const handleExportPDF = () => {
    exportToPDF('Ranking da Zeladoria');
  };

  const handleRefreshData = async () => {
    console.log("Dados sendo atualizados...");
    // Add data refresh functionality here
  };

  return (
    <div className="space-y-6 bg-[#FFFAFA]">
      <motion.div 
        className="max-w-full mx-auto pdf-content" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <WelcomeCard 
          title="Ranking da Zeladoria"
          description="Acompanhamento de desempenho e análises de ações, projetos e obras."
          icon={<BarChart3 className="h-6 w-6 mr-2 text-white" />}
          color="bg-gradient-to-r from-blue-700 to-blue-900"
        />
        
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
          <RankingContent 
            filterDialogOpen={filterDialogOpen} 
            setFilterDialogOpen={setFilterDialogOpen}
            buttonText="Atualizar"
            lastUpdateText="Última Atualização"
            onRefreshData={handleRefreshData}
          />
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .mobile-kpi-grid .kpi-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}} />
    </div>
  );
};

export default RankingSubs;
