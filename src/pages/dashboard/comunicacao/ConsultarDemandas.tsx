
import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import ConsultarDemandasContent from '@/components/consultar-demandas/ConsultarDemandasContent';

const ConsultarDemandas = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Consultar Demandas"
        description="Pesquise e visualize todas as solicitações"
        icon={<Search className="h-6 w-6 mr-2" />}
        statTitle="Demandas"
        statIcon={<MessageSquare size={18} />}
        statDescription="Total de demandas"
        color="bg-gradient-to-r from-emerald-500 to-emerald-700"
      />
      
      <div className="mt-6">
        <ConsultarDemandasContent />
      </div>
    </div>
  );
};

export default ConsultarDemandas;
