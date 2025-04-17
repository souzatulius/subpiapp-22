
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand, ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { useNavigate } from 'react-router-dom';

export const useNotaForm = (onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDemandaId, setSelectedDemandaId] = useState('');
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [demandaResponse, setDemandaResponse] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');

  const fetchDemandResponse = async (demandaId: string) => {
    try {
      console.log('Fetching response for demanda:', demandaId);
      
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('texto, comentarios, respostas')
        .eq('demanda_id', demandaId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching response:', error);
        throw error;
      }
      
      console.log('Response data:', data);
      
      if (data) {
        setDemandaResponse(data.texto || null);
        setComentarios(data.comentarios || null);
        
        // If we have a structured respostas object, convert it to text
        if (data.respostas && typeof data.respostas === 'object') {
          try {
            let respostasText = '';
            Object.entries(data.respostas).forEach(([key, value]) => {
              // Get the question text from the selectedDemanda.perguntas object
              const questionText = selectedDemanda?.perguntas?.[key] || `Pergunta ${Number(key) + 1}`;
              respostasText += `Pergunta: ${questionText}\nResposta: ${value}\n\n`;
            });
            setDemandaResponse(respostasText);
          } catch (parseError) {
            console.error('Error parsing respostas:', parseError);
          }
        }
      } else {
        setDemandaResponse(null);
        setComentarios(null);
      }
    } catch (error) {
      console.error('Erro ao carregar respostas da demanda:', error);
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar as respostas da demanda.",
        variant: "destructive"
      });
    }
  };

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
      await fetchDemandResponse(demandaId);
      
      // Update the selected demand with comments if we have them
      if (comentarios) {
        setSelectedDemanda({
          ...selected,
          comentarios
        });
      }
    } else {
      console.error('Selected demand not found in demandas array');
    }
    
    setStep('create-note');
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setDemandaResponse(null);
    setComentarios(null);
    setTitulo('');
    setTexto('');
  };

  const handleSubmit = async () => {
    // Validação
    if (!titulo.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!texto.trim()) {
      toast({
        title: "Conteúdo obrigatório",
        description: "Por favor, informe o conteúdo da nota oficial.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDemanda) {
      toast({
        title: "Demanda inválida",
        description: "Selecione uma demanda válida.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Use the problema_id from the selected demand if it has one
      const problemaId = selectedDemanda.problema_id || selectedDemanda.problema?.id;
      const coordenacaoId = selectedDemanda.coordenacao_id || selectedDemanda.coordenacao?.id;
      
      // Create the note
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo,
          texto,
          coordenacao_id: coordenacaoId,
          autor_id: user?.id,
          status: 'pendente',
          demanda_id: selectedDemandaId,
          problema_id: problemaId
        })
        .select();
      
      if (error) throw error;
      
      // Update the demand status after creating the note
      const { error: updateError } = await supabase
        .from('demandas')
        .update({ status: 'respondida' })
        .eq('id', selectedDemandaId);
        
      if (updateError) {
        console.error('Error updating demand status:', updateError);
        // We don't throw here to avoid canceling the whole operation
      }
      
      toast({
        title: "Nota oficial criada com sucesso!",
        description: "A nota foi enviada para aprovação.",
      });
      
      // Redirect to the dashboard
      navigate('/dashboard/comunicacao');
    } catch (error: any) {
      console.error('Erro ao criar nota oficial:', error);
      toast({
        title: "Erro ao criar nota oficial",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format the responses text
  const formatResponses = (responseText: string | null): ResponseQA[] => {
    if (!responseText) return [];
    
    // Split by double newlines to get question-answer pairs
    const pairs = responseText.split('\n\n');
    return pairs.map(pair => {
      const lines = pair.split('\n');
      if (lines.length >= 2) {
        // Extract question and answer
        const question = lines[0].replace('Pergunta: ', '');
        const answer = lines[1].replace('Resposta: ', '');
        return { question, answer };
      }
      return { question: '', answer: '' };
    }).filter(qa => qa.question && qa.answer);
  };

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
    comentarios,
    handleDemandaSelect,
    handleBackToSelection,
    handleSubmit
  };
};
