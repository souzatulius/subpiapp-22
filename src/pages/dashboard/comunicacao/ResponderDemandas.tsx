
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, FileText } from 'lucide-react';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useIsMobile } from '@/hooks/use-mobile';

const ResponderDemandas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const demandaId = query.get('id');
  const { firstName } = useDashboardState();
  const isMobile = useIsMobile();
  
  const handleNavigateToConsultar = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Responder Demandas"
        description={`Olá ${firstName}, atenda às solicitações pendentes de comunicação`}
        icon={<MessageCircle className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-700 to-blue-800"
        showButton={!isMobile} // Hide button on mobile
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
