
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import ConsultarDemandasContent from '@/components/consultar-demandas/ConsultarDemandasContent';

const ConsultarDemandas = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      <WelcomeCard
        title="Consultar Demandas"
        description="Visualize o histórico completo de demandas de comunicação"
        icon={<FileText className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
      />
      
      <div className="mt-6">
        <ConsultarDemandasContent />
      </div>
    </div>
  );
};

export default ConsultarDemandas;
