
import React from 'react';
import { PieChart, SlidersHorizontal } from 'lucide-react';
import { RelatoriosContent } from '@/components/relatorios';
import WelcomeCard from '@/components/shared/WelcomeCard';
import StatCard from '@/components/settings/components/StatCard';

const RelatoriosPage = () => {
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <WelcomeCard
          title="Relatórios"
          description="Visualize estatísticas e relatórios de comunicação"
          icon={<PieChart className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-teal-500 to-teal-700"
        />
        
        <div className="w-full md:w-auto">
          <StatCard 
            showButton={true}
            buttonText="Filtros e Configurações"
            buttonIcon={<SlidersHorizontal className="h-4 w-4" />}
            buttonVariant="outline"
            onButtonClick={() => setFilterDialogOpen(true)}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <RelatoriosContent />
      </div>
    </div>
  );
};

export default RelatoriosPage;
