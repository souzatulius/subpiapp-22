
import React from 'react';
import { PlusCircle } from 'lucide-react';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';

const CadastrarDemanda = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Nova Solicitação"
        description="Cadastre uma nova solicitação de comunicação"
        icon={<PlusCircle className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-indigo-500 to-indigo-700"
      />
      
      <div className="mt-6">
        <CadastrarDemandaForm />
      </div>
    </div>
  );
};

export default CadastrarDemanda;
