
import React from 'react';
import AprovarNotaForm from '@/components/dashboard/forms/AprovarNotaForm';

const AprovarNotaOficial = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Aprovar Nota Oficial</h1>
      <AprovarNotaForm onClose={() => {}} />
    </div>
  );
};

export default AprovarNotaOficial;
