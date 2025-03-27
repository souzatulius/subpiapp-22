
import { useState, useEffect } from 'react';

export const useRequesterInfoLogic = (formData: {
  veiculo_imprensa: string;
  nome_solicitante: string;
  telefone_solicitante: string;
}) => {
  const [showNomeSolicitante, setShowNomeSolicitante] = useState(false);
  const [showTelefone, setShowTelefone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (formData.veiculo_imprensa && formData.veiculo_imprensa.trim() !== '') {
      setShowNomeSolicitante(true);
    }
    
    if (formData.nome_solicitante && formData.nome_solicitante.trim() !== '') {
      setShowTelefone(true);
    }
    
    if (formData.telefone_solicitante && formData.telefone_solicitante.trim() !== '') {
      setShowEmail(true);
    }
  }, [formData.veiculo_imprensa, formData.nome_solicitante, formData.telefone_solicitante]);

  return {
    showNomeSolicitante,
    showTelefone,
    showEmail
  };
};
