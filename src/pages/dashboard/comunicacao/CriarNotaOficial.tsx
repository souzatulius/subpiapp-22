
import React from 'react';
import { FileEdit } from 'lucide-react';
import CriarNotaForm from '@/components/dashboard/forms/CriarNotaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';

const CriarNotaOficial = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Criar Nota Oficial"
        description="Elabore uma nova nota oficial de comunicação"
        icon={<FileEdit className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-purple-500 to-purple-700"
      />
      
      <div className="mt-6">
        <CriarNotaForm />
      </div>
    </div>
  );
};

export default CriarNotaOficial;
