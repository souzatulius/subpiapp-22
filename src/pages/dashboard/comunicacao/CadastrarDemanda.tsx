
import React from 'react';
import { PlusCircle } from 'lucide-react';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';

const CadastrarDemanda = () => {
  // Create a dummy onClose function since we're in a page context
  const onClose = () => {
    // This is a dummy function since we're on a page not in a modal
    console.log('Close action triggered');
  };

  return (
    <div className="w-full mx-auto">
      <WelcomeCard
        title="Nova Demanda"
        description="Cadastre uma nova solicitação de comunicação"
        icon={<PlusCircle className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
      />
      
      <div className="mt-6">
        <CadastrarDemandaForm onClose={onClose} />
      </div>
    </div>
  );
};

export default CadastrarDemanda;
