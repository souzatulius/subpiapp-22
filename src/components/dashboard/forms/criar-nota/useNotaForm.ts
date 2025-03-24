
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Demand, ResponseQA, DemandResponse } from './types';

export const useNotaForm = (onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDemanda, setSelectedDemanda] = useState<Demand | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select-demand' | 'create-note'>('select-demand');
  const [formattedResponses, setFormattedResponses] = useState<ResponseQA[]>([]);

  useEffect(() => {
    if (selectedDemanda) {
      setTitulo(`Nota oficial: ${selectedDemanda.titulo}`);
    }
  }, [selectedDemanda]);

  const handleDemandaSelect = async (demandaId: string, demandas: Demand[]) => {
    const selected = demandas.find(d => d.id === demandaId);
    
    if (selected) {
      setSelectedDemanda(selected);
      
      try {
        // Fetch responses for this demand
        const { data: responseData, error } = await supabase
          .from('respostas_demandas')
          .select('*')
          .eq('demanda_id', demandaId)
          .order('criado_em', { ascending: true });
          
        if (error) throw error;
        
        if (responseData && responseData.length > 0) {
          const formattedQA: ResponseQA[] = [];
          
          // Format responses using individual questions and answers
          for (const response of responseData) {
            // If using the new format with respostas field
            if (response.respostas && Object.keys(response.respostas).length > 0) {
              Object.entries(response.respostas).forEach(([key, answer]) => {
                const question = selected.perguntas?.[key] || `Pergunta ${Number(key) + 1}`;
                formattedQA.push({
                  question,
                  answer: answer as string
                });
              });
            } else if (response.texto) {
              // Try to parse text-based responses
              const textChunks = response.texto.split('\n\n');
              for (const chunk of textChunks) {
                const perguntaMatch = chunk.match(/Pergunta:\s*(.+?)(?:\n|$)/);
                const respostaMatch = chunk.match(/Resposta:\s*(.+?)(?:\n|$)/);
                
                if (perguntaMatch && respostaMatch) {
                  formattedQA.push({
                    question: perguntaMatch[1].trim(),
                    answer: respostaMatch[1].trim()
                  });
                }
              }
            }
          }
          
          setFormattedResponses(formattedQA);
        }
        
        setStep('create-note');
      } catch (error) {
        console.error('Error fetching responses:', error);
        toast.error("Erro ao carregar respostas", {
          description: "Não foi possível carregar as respostas para esta demanda."
        });
      }
    }
  };

  const handleBackToSelection = () => {
    setStep('select-demand');
    setSelectedDemanda(null);
    setTitulo('');
    setTexto('');
    setFormattedResponses([]);
  };

  const handleSubmit = async () => {
    if (!selectedDemanda || !titulo || !texto || !user?.id) {
      toast.error("Formulário incompleto", {
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Use problema_id instead of area_coordenacao_id
      const { error } = await supabase.from('notas_oficiais').insert({
        titulo,
        texto,
        demanda_id: selectedDemanda.id,
        problema_id: selectedDemanda.problema?.id,
        autor_id: user.id,
        status: 'pendente'
      });

      if (error) throw error;

      toast.success("Nota enviada com sucesso!", {
        description: "A nota oficial foi enviada para aprovação."
      });

      if (onClose) {
        onClose();
      } else {
        navigate('/dashboard/comunicacao/consultar-notas');
      }
    } catch (error: any) {
      console.error('Erro ao enviar nota:', error);
      toast.error("Erro ao enviar nota", {
        description: error.message || "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
