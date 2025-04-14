
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import ConsultarNotasTable from '@/components/dashboard/ConsultarNotasTable';
import WelcomeCard from '@/components/shared/WelcomeCard';

const ConsultarNotas = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Consultar Notas Oficiais"
        description="Visualize o histórico de notas oficiais emitidas pela secretaria"
        icon={<FileText className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
      />
      
      <div className="mt-6">
        <ConsultarNotasTable />
      </div>
    </div>
  );
};

export default ConsultarNotas;
