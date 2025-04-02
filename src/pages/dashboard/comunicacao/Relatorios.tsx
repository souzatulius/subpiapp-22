
import React, { useState, useEffect } from 'react';
import { PieChart, SlidersHorizontal, PlusCircle } from 'lucide-react';
import { RelatoriosContent } from '@/components/relatorios';
import WelcomeCard from '@/components/shared/WelcomeCard';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const RelatoriosPage = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('RelatoriosPage montado');
    return () => {
      console.log('RelatoriosPage desmontado');
    };
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Relatórios"
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
        <RelatoriosContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
      </div>

      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
    </div>
  );
};

export default RelatoriosPage;
