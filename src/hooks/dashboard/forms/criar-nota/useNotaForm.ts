
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
import { toast } from '@/components/ui/use-toast';

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

  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    console.log("Selecting demand for creating note:", demandaId);
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      console.log("Selected demand:", selected);
      setSelectedDemanda(selected);
      
      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
      
      // Fetch responses for this demand
      try {
        const { responseText, comments } = await fetchDemandResponse(demandaId);
        console.log("Fetched response:", { responseText, comments });
        setDemandaResponse(responseText);
        setDemandaComments(comments);
        
        // Update the selected demand with comments
        if (comments) {
          setSelectedDemanda({
            ...selected,
            comentarios: comments
          });
        }
      } catch (error) {
        console.error("Error fetching demand response:", error);
        toast({
          title: "Erro ao carregar respostas",
          description: "Não foi possível carregar as respostas da demanda selecionada.",
          variant: "destructive"
        });
      }
    } else {
      console.error("Could not find selected demand in demandas array");
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
      console.error('Por favor, preencha todos os campos obrigatórios.');
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Validation passed, proceeding with submission");
      
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
        // Redirect to dashboard
        navigate('/dashboard/comunicacao');
      } else {
        console.error('Erro ao criar nota. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Erro ao criar nota",
        description: error.message || "Ocorreu um erro ao criar a nota oficial.",
        variant: "destructive"
      });
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
