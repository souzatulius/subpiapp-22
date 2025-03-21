
import React from 'react';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';

const ResponderDemandas = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Responder Demandas</h1>
      <ResponderDemandaForm onClose={() => {}} />
    </div>
  );
};

export default ResponderDemandas;
