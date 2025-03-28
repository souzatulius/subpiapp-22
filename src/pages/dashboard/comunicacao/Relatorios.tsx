
import React, { useState } from 'react';
import { PieChart, SlidersHorizontal } from 'lucide-react';
import { RelatoriosContent } from '@/components/relatorios';
import WelcomeCard from '@/components/shared/WelcomeCard';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';

const RelatoriosPage = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Relatórios"
        description="Visualize estatísticas e relatórios de comunicação"
        icon={<PieChart className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-teal-500 to-teal-700"
        showButton={true}
        buttonText="Filtros e Visualização"
        buttonIcon={<SlidersHorizontal className="h-4 w-4" />}
        buttonVariant="outline"
        onButtonClick={() => setFilterDialogOpen(true)}
      />
      
      <div className="mt-6">
        <RelatoriosContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
      </div>

      {/* Filter Dialog */}
      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
    </div>
  );
};

export default RelatoriosPage;
