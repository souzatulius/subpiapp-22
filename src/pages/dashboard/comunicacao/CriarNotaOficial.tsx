
import React from 'react';
import CriarNotaForm from '@/components/dashboard/forms/CriarNotaForm';

const CriarNotaOficial = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Criar Nota Oficial</h1>
      <CriarNotaForm onClose={() => {}} />
    </div>
  );
};

export default CriarNotaOficial;
