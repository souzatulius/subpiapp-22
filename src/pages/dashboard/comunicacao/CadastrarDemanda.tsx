
import React from 'react';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';

const CadastrarDemanda = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Demanda</h1>
      <CadastrarDemandaForm onClose={() => {}} />
    </div>
  );
};

export default CadastrarDemanda;
