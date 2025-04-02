
import React from 'react';
import { PieChart, SlidersHorizontal } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const RelatoriosPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Relatórios"
        description="Visualize estatísticas e relatórios de comunicação"
        icon={<PieChart className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-orange-500 to-orange-700"
      />
    </div>
  );
};

export default RelatoriosPage;
