
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { RelatoriosContent } from '@/components/relatorios';
import { PieChart, SlidersHorizontal } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import FilterDialog from '@/components/shared/FilterDialog';
import { motion } from 'framer-motion';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { useScrollFade } from '@/hooks/useScrollFade';
import { ReportFilters } from '@/components/relatorios/hooks/useReportsData';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/hooks/use-toast';
import '@/components/ranking/charts/ChartRegistration';

const Relatorios = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});
  const isMobile = useIsMobile();
  const scrollFadeStyles = useScrollFade({ threshold: 10, fadeDistance: 80 });
  const [chartVisibility, setChartVisibility] = useLocalStorage<Record<string, boolean>>('relatorios-chart-visibility', {
    origemDemandas: true,
    distribuicaoPorTemas: true,
    tempoMedioResposta: true,
    performanceArea: true,
    notasEmitidas: true,
    noticiasVsReleases: true,
    problemasComuns: true,
    demandasEsic: true,
    resolucaoEsic: true,
    processosCadastrados: true
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFAFA]">
      <div className="flex-shrink-0">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        {isMobile && (
          <div className="bg-white">
            <BreadcrumbBar />
          </div>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {!isMobile && (
            <div className="flex-shrink-0">
              <BreadcrumbBar />
            </div>
          )}
          
          <div className="flex-1 max-w-full mx-auto w-full overflow-y-auto">
            <div className={`p-4 ${isMobile ? 'pb-24' : 'pb-16'}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <div className="transition-all duration-300">
                  <WelcomeCard 
                    title="Relatórios" 
                    description="Visualize estatísticas e relatórios de comunicação" 
                    icon={<PieChart className="h-6 w-6 mr-2" />} 
                    color="bg-gradient-to-r from-blue-100 via-orange-300 to-gray-500"
                    showButton={true}
                    buttonText="Filtros e Visualização"
                    buttonIcon={<SlidersHorizontal className="h-4 w-4" />}
                    buttonVariant="default"
                    onButtonClick={() => setFilterDialogOpen(true)}
                    showResetButton={false}
                  />
                </div>
               
                {isMobile && (
                  <div className="bg-white rounded-md shadow-sm mt-4">
                    <BreadcrumbBar />
                  </div>
                )}
               
                <div className="mt-6">
                  <RelatoriosContent 
                    filterDialogOpen={filterDialogOpen} 
                    setFilterDialogOpen={setFilterDialogOpen} 
                    filters={filters}
                  />
                </div>

                <FilterDialog 
                  open={filterDialogOpen} 
                  onOpenChange={setFilterDialogOpen}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav className="flex-shrink-0" />}
    </div>
  );
};

export default Relatorios;
