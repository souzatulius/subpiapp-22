
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import ConsultarDemandasTable from '@/components/dashboard/ConsultarDemandasTable';
import WelcomeCard from '@/components/shared/WelcomeCard';

const ConsultarDemandas = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Consultar Demandas"
        description="Visualize o histórico completo de demandas de comunicação"
        icon={<FileText className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-cyan-600 to-cyan-800"
      />
      
      <div className="mt-6">
        <ConsultarDemandasTable />
      </div>
    </div>
  );
};

export default ConsultarDemandas;
