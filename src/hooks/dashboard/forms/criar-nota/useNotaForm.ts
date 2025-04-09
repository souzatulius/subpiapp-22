
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand } from '@/components/dashboard/forms/criar-nota/types';
import { ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { useNavigate } from 'react-router-dom';
import { fetchDemandResponse } from './api/fetchDemandResponse';
import { formatResponses } from './utils/formatResponses';
import { submitNotaForm } from './api/submitNotaForm';
import { validateNotaForm } from './validators/validateNotaForm';

export const useNotaForm = (onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [demandaResponse, setDemandaResponse] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');

  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      setSelectedDemanda(selected);
      
      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
      
      // Fetch responses for this demand
      const responseText = await fetchDemandResponse(demandaId);
      setDemandaResponse(responseText);
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setDemandaResponse(null);
    setTitulo('');
    setTexto('');
  };

  const handleSubmit = async () => {
    // Validation
    const isValid = validateNotaForm({
      titulo,
      texto,
      selectedDemanda
    });
    
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      
      const success = await submitNotaForm({
        titulo,
        texto,
        userId: user?.id,
        selectedDemandaId,
        selectedDemanda
      });
      
      if (success) {
        // Redirect to dashboard
        navigate('/dashboard/comunicacao');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format the responses
  const formattedResponses = formatResponses(demandaResponse);

  return {
    selectedDemandaId,
    selectedDemanda,
    titulo,
    setTitulo,
    texto,
    setTexto,
    isSubmitting,
    step,
    formattedResponses,
    handleDemandaSelect,
    handleBackToSelection,
    handleSubmit
  };
};
