
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useDashboardState } from '@/hooks/useDashboardState';

const ResponderDemandas = () => {
  const { firstName } = useDashboardState();
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Responder Demandas"
        description={`Olá ${firstName}, atenda às solicitações pendentes de comunicação`}
        icon={<MessageCircle className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-700 to-blue-800"
      />
      
      <div className="mt-6 rounded-xl overflow-hidden">
        <ResponderDemandaForm />
      </div>
    </div>
  );
};

export default ResponderDemandas;
