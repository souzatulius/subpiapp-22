
import React from 'react';
import { FileEdit } from 'lucide-react';
import CriarNotaForm from '@/components/dashboard/forms/CriarNotaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';

const CriarNotaOficial = () => {
  // Create a dummy onClose function since we're in a page context
  const onClose = () => {
    // This is a dummy function since we're on a page not in a modal
    console.log('Close action triggered');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Criar Nota Oficial"
        description="Elabore uma nova nota oficial de comunicação"
        icon={<FileEdit className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-700 to-blue-900"
      />
      
      <div className="mt-6">
        <CriarNotaForm onClose={onClose} />
      </div>
    </div>
  );
};

export default CriarNotaOficial;
