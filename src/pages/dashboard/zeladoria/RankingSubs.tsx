import React, { useState } from 'react';
import { BarChart3, SlidersHorizontal, Printer, FileText } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import '@/components/ranking/charts/ChartRegistration';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import RankingContent from '@/components/ranking/RankingContent';
import { useIsMobile } from '@/hooks/use-mobile';
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
  return <div className="space-y-6 bg-[#FFFAFA]">
      <motion.div className="max-w-full mx-auto pdf-content" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <WelcomeCard title="Ranking da Zeladoria" description="Acompanhamento de desempenho e análises de ações, projetos e obras." icon={<BarChart3 className="text-blue-300 h-15 w-15" />} color="bg-gradient-to-r from-blue-700 to-blue-900" className="h-15 w-15 mr-3 text-gray-300" />
        
        {!isMobile && <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrint} className="bg-white hover:bg-gray-100 border-gray-200 rounded-3xl">
              <Printer className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={handleExportPDF} className="bg-white hover:bg-gray-100 border-gray-200 rounded-3xl">
              <FileText className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Button variant="outline" size="icon" onClick={() => setFilterDialogOpen(true)} className="bg-white hover:bg-gray-100 border-gray-200 rounded-3xl">
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
            </Button>
          </div>}
        
        <div className={`${isMobile ? 'mt-3' : 'mt-6'} max-w-full overflow-x-hidden`}>
          <RankingContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} buttonText="Atualizar" lastUpdateText="Última Atualização" onRefreshData={handleRefreshData} />
        </div>
      </motion.div>
    </div>;
};
export default RankingSubs;