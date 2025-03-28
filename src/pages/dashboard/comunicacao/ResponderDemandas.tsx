
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText } from 'lucide-react';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';

const ResponderDemandas = () => {
  const navigate = useNavigate();
  
  const handleNavigateToConsultar = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Responder Demandas"
        description="Atenda às solicitações pendentes de comunicação"
        icon={<MessageCircle className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-700 to-blue-800"
        showButton={true}
        buttonText="Consultar Outras Demandas"
        buttonIcon={<FileText className="h-4 w-4" />}
        buttonVariant="outline"
        onButtonClick={handleNavigateToConsultar}
      />
      
      <div className="mt-6">
        <ResponderDemandaForm />
      </div>
    </div>
  );
};

export default ResponderDemandas;
