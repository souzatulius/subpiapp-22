
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Demand, ResponseQA } from '@/types/demand';
import { useNavigate } from 'react-router-dom';

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

  const fetchDemandResponse = async (demandaId: string) => {
    try {
      const { data, error } = await supabase
        .from('respostas_demandas')
        .select('*')
        .eq('demanda_id', demandaId)
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setDemandaResponse(data[0].texto);
      } else {
        setDemandaResponse(null);
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

  const handleDemandaSelect = (demandaId: string, demandas: Demand[]) => {
    setSelectedDemandaId(demandaId);
    
    // Find the selected demand
    const selected = demandas.find(d => d.id === demandaId);
    if (selected) {
      setSelectedDemanda(selected);
      // Fetch responses for this demand
      fetchDemandResponse(demandaId);

      // Set a default title based on the demand title
      setTitulo(selected.titulo || '');
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
      
      // Get problema data to associate with the note
      const { data: problemaData, error: problemaError } = await supabase
        .from('problemas')
        .select('id, coordenacao_id')
        .eq('id', selectedDemanda.problema_id)
        .maybeSingle();
      
      if (problemaError && problemaError.code !== 'PGRST116') {
        throw problemaError;
      }
      
      let problemaId = selectedDemanda.problema_id;
      let coordenacaoId = problemaData?.coordenacao_id || selectedDemanda.coordenacao_id || null;
      
      if (!problemaId) {
        // If no problema_id found on demand, create a default one
        const { data: newProblema, error: newProblemaError } = await supabase
          .from('problemas')
          .insert({ 
            descricao: 'Problema Padrão',
            coordenacao_id: coordenacaoId
          })
          .select();
          
        if (newProblemaError) throw newProblemaError;
        
        problemaId = newProblema[0].id;
      }
      
      // Create the note including coordenacao_id from the problema
      const { data, error } = await supabase
        .from('notas_oficiais')
        .insert({
          titulo,
          texto,
          autor_id: user?.id,
          status: 'pendente',
          demanda_id: selectedDemandaId,
          problema_id: problemaId,
          coordenacao_id: coordenacaoId
        })
        .select();
      
      if (error) throw error;
      
      // Update the demand status to reflect that a note has been created
      const { error: updateError } = await supabase
        .from('demandas')
        .update({ status: 'aguardando_aprovacao' })
        .eq('id', selectedDemandaId);
        
      if (updateError) {
        console.error('Error updating demand status:', updateError);
        // Don't throw here, we still want to show success for the note creation
      }
      
      toast({
        title: "Nota oficial criada com sucesso!",
        description: "A nota foi enviada para aprovação.",
      });
      
      // Redirect to dashboard
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
    handleDemandaSelect,
    handleBackToSelection,
    handleSubmit
  };
};
