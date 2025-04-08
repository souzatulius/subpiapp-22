
import React, { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useLocation } from 'react-router-dom';

const CadastrarDemanda = () => {
  const location = useLocation();
  
  // Create a dummy onClose function since we're in a page context
  const onClose = () => {
    // This is a dummy function since we're on a page not in a modal
    console.log('Close action triggered');
  };

  // Log the query parameters for debugging
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const origemId = searchParams.get('origem_id');
    if (origemId) {
      console.log('Origem ID from URL:', origemId);
    }
  }, [location.search]);

  return (
    <div className="w-full mx-auto">
      <WelcomeCard
        title="Nova Demanda"
        description="Cadastre uma nova solicitação de comunicação"
        icon={<PlusCircle className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
      />
      
      <div className="mt-4">
        <CadastrarDemandaForm onClose={onClose} />
      </div>
    </div>
  );
};

export default CadastrarDemanda;
