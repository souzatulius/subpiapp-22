
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { RelatoriosContent } from '@/components/relatorios';
import { PieChart, SlidersHorizontal } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';
import { motion } from 'framer-motion';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { ReportFilters } from '@/components/relatorios/hooks/useReportsData';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const Relatorios = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto">
            <div className="p-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <WelcomeCard 
                  title="Relatórios!" 
                  description="Visualize estatísticas e relatórios de comunicação" 
                  icon={<PieChart className="h-6 w-6 mr-2" />} 
                  color="bg-gradient-to-r from-orange-500 to-orange-700"
                  showButton={true}
                  buttonText="Filtros e Visualização"
                  buttonIcon={<SlidersHorizontal className="h-4 w-4" />}
                  buttonVariant="action"
                  onButtonClick={() => setFilterDialogOpen(true)}
                />
               
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
                  onFiltersChange={handleFiltersChange}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Relatorios;
