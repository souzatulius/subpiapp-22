
import React from 'react';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';
import { useNavigate } from 'react-router-dom';

const CadastrarDemanda = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Nova Demanda</h1>
        <p className="text-gray-600">Preencha os campos para registrar uma nova demanda de comunicação.</p>
      </div>
      <CadastrarDemandaForm onClose={handleClose} />
    </div>
  );
};

export default CadastrarDemanda;
