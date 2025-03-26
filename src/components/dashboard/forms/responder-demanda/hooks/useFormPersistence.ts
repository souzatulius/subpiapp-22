
import { useEffect } from 'react';

interface UseFormPersistenceProps {
  demandaId: string | null;
  resposta: Record<string, string>;
  comentarios: string;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setComentarios?: React.Dispatch<React.SetStateAction<string>>;
  setLocalComentarios: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const useFormPersistence = ({
  demandaId,
  resposta,
  comentarios,
  setResposta,
  setComentarios,
  setLocalComentarios,
  activeTab,
  setActiveTab
}: UseFormPersistenceProps) => {
  // Persist active tab in session storage
  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeRespostaTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, [setActiveTab]);

  useEffect(() => {
    sessionStorage.setItem('activeRespostaTab', activeTab);
  }, [activeTab]);

  // Persist form data in session storage
  useEffect(() => {
    if (demandaId) {
      const formKey = `resposta_form_${demandaId}`;
      const savedData = sessionStorage.getItem(formKey);
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData.resposta && Object.keys(parsedData.resposta).length > 0) {
            setResposta(parsedData.resposta);
          }
          if (parsedData.comentarios) {
            if (setComentarios) {
              setComentarios(parsedData.comentarios);
            }
            setLocalComentarios(parsedData.comentarios);
          }
        } catch (e) {
          console.error('Erro ao recuperar dados do formulário:', e);
        }
      }
    }
  }, [demandaId, setResposta, setComentarios, setLocalComentarios]);

  // Save form data to session storage
  useEffect(() => {
    if (demandaId) {
      const formKey = `resposta_form_${demandaId}`;
      const dataToSave = {
        resposta,
        comentarios
      };
      sessionStorage.setItem(formKey, JSON.stringify(dataToSave));
    }
  }, [resposta, comentarios, demandaId]);

  // Clean up session storage after submission
  const clearFormStorage = () => {
    if (demandaId) {
      const formKey = `resposta_form_${demandaId}`;
      sessionStorage.removeItem(formKey);
    }
  };

  return { clearFormStorage };
};
