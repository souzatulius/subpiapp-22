
import React from 'react';
import { Search, FileText } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import NotasContent from '@/components/consultar-notas/NotasContent';

const ConsultarNotas = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Consultar Notas Oficiais"
        description="Pesquise e visualize todas as notas oficiais"
        icon={<Search className="h-6 w-6 mr-2" />}
        statTitle="Notas"
        statIcon={<FileText size={18} />}
        statDescription="Total de notas"
        color="bg-gradient-to-r from-cyan-500 to-cyan-700"
      />
      
      <div className="mt-6">
        <NotasContent />
      </div>
    </div>
  );
};

export default ConsultarNotas;
