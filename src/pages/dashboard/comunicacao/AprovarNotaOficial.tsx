
import React from 'react';
import { CheckCircle } from 'lucide-react';
import AprovarNotaForm from '@/components/dashboard/forms/AprovarNotaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';

const AprovarNotaOficial = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Aprovar Nota"
        description="Revise e aprove notas oficiais pendentes"
        icon={<CheckCircle className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-blue-800 to-blue-950"
      />
      
      <div className="mt-6">
        <AprovarNotaForm />
      </div>
    </div>
  );
};

export default AprovarNotaOficial;
