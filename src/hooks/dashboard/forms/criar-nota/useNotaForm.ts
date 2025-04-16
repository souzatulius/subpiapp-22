
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand } from '@/components/dashboard/forms/criar-nota/types';
import { ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { useNavigate } from 'react-router-dom';
import { fetchDemandResponse } from './api/fetchDemandResponse';
import { formatResponses } from './utils/formatResponses';
import { submitNotaForm, setFeedbackFunction } from './api/submitNotaForm';
import { validateNotaForm } from './validators/validateNotaForm';
import { adaptDemandType } from './utils/typeAdapters';
import { useFeedback } from '@/components/ui/feedback-provider';

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
  const { showFeedback } = useFeedback();

  // Set the feedback function for the submitNotaForm to use
  setFeedbackFunction(showFeedback);

  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      setSelectedDemanda(selected);
      
      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
      
      showFeedback('loading', 'Carregando respostas da demanda...', { progress: 50 });
      
      // Fetch responses for this demand
      try {
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
        
        showFeedback('success', 'Demanda carregada com sucesso!');
      } catch (error) {
        showFeedback('error', 'Erro ao carregar respostas da demanda');
        console.error(error);
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
      
      // Use the adapter to convert the demand type if selectedDemanda exists
      const adaptedDemanda = selectedDemanda ? adaptDemandType(selectedDemanda) : null;
      
      const success = await submitNotaForm({
        titulo,
        texto,
        userId: user?.id,
        selectedDemandaId,
        selectedDemanda: adaptedDemanda
      });
      
      if (success) {
        // Redirect to dashboard
        navigate('/dashboard/comunicacao');
      }
    } catch (error: any) {
      showFeedback('error', `Erro durante a submissão: ${error.message || 'Erro desconhecido'}`);
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
