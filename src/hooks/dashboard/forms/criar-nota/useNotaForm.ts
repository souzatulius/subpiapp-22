
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand } from '@/components/dashboard/forms/criar-nota/types';
import { ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { useNavigate } from 'react-router-dom';
import { fetchDemandResponse } from './api/fetchDemandResponse';
import { formatResponses } from './utils/formatResponses';
import { submitNotaForm } from './api/submitNotaForm';
import { validateNotaForm } from './validators/validateNotaForm';
import { adaptDemandType } from './utils/typeAdapters';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const useNotaForm = (onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [demandaResponse, setDemandaResponse] = useState<string | null>(null);
  const [demandaComments, setDemandaComments] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');
  const { showFeedback } = useAnimatedFeedback();

  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      console.log("Selected demand:", selected);
      setSelectedDemanda(selected);
      
      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
      
      // Fetch responses for this demand
      const { responseText, comments } = await fetchDemandResponse(demandaId);
      setDemandaResponse(responseText);
      setDemandaComments(comments);
      
      // Update the selected demand with comments
      if (comments) {
        setSelectedDemanda({
          ...selected,
          comentarios: comments
        });
      }
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setDemandaResponse(null);
    setDemandaComments(null);
    setTitulo('');
    setTexto('');
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked with data:", {
      titulo,
      texto,
      selectedDemanda: selectedDemanda ? { id: selectedDemanda.id, titulo: selectedDemanda.titulo } : null
    });
    
    // Validation
    const isValid = validateNotaForm({
      titulo,
      texto,
      selectedDemanda
    });
    
    if (!isValid) {
      showFeedback('error', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Validation passed, proceeding with submission");
      
      // Show "processing" feedback
      showFeedback('loading', 'Processando sua solicitação...', { progress: 50 });
      
      // Use the adapter to convert the demand type if selectedDemanda exists
      const adaptedDemanda = selectedDemanda ? adaptDemandType(selectedDemanda) : null;
      
      console.log("Adapted demand:", adaptedDemanda);
      
      const success = await submitNotaForm({
        titulo,
        texto,
        userId: user?.id,
        selectedDemandaId,
        selectedDemanda: adaptedDemanda
      });
      
      if (success) {
        console.log("Note created successfully, navigating to dashboard");
        // Show success feedback
        showFeedback('success', 'Nota criada com sucesso!');
        // Redirect to dashboard
        navigate('/dashboard/comunicacao');
      } else {
        // Show error feedback if success is false
        showFeedback('error', 'Erro ao criar nota. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      showFeedback('error', error.message || 'Ocorreu um erro inesperado. Tente novamente.');
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
    demandaComments,
    handleDemandaSelect,
    handleBackToSelection,
    handleSubmit
  };
};
