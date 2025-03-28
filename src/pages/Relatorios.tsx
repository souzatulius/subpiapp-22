
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { RelatoriosContent } from '@/components/relatorios';
import { PieChart, SlidersHorizontal, PlusCircle } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';
import { motion } from 'framer-motion';

const Relatorios = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <motion.div 
            className="max-w-7xl mx-auto" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <WelcomeCard 
              title="Relatórios" 
              description="Visualize estatísticas e relatórios de comunicação" 
              icon={<PieChart className="h-6 w-6 mr-2" />} 
              color="bg-gradient-to-r from-blue-500 to-blue-700"
              showButton={true}
              buttonText="Novo Relatório"
              buttonIcon={<PlusCircle className="h-4 w-4" />}
              buttonVariant="action"
              onButtonClick={() => setFilterDialogOpen(true)}
            />
           
            <div className="mt-6">
              <RelatoriosContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
            </div>

            <FilterDialog 
              open={filterDialogOpen} 
              onOpenChange={setFilterDialogOpen} 
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Relatorios;
