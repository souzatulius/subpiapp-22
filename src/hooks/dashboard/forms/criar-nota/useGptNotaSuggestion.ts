
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demand, ResponseQA } from '@/components/dashboard/forms/criar-nota/types';
import { supabase } from '@/integrations/supabase/client';

export const useGptNotaSuggestion = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestion = async (
    selectedDemanda: Demand | null,
    formattedResponses: ResponseQA[] = []
  ) => {
    if (!selectedDemanda) {
      toast({
        title: "Erro",
        description: "Nenhuma demanda selecionada para gerar sugestão.",
        variant: "destructive"
      });
      return { titulo: '', nota: '' };
    }

    try {
      setIsGenerating(true);
      
      // Get current date formatted in Portuguese
      const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      
      // Prepare data for generation
      const dados = {
        resumo: selectedDemanda.titulo || '',
        perguntas: formattedResponses.map(qa => qa.question), // Fixed: using question instead of pergunta
        respostas: formattedResponses.map(qa => qa.answer),   // Fixed: using answer instead of resposta
        dataAtual: currentDate,
        comentariosAdicionais: selectedDemanda.detalhes_solicitacao || ''
      };
      
      // Use the unified edge function
      const { data, error } = await supabase.functions.invoke('generate-with-gpt', {
        body: {
          tipo: 'nota_imprensa',
          dados
        }
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const resultado = data.resultado;
      
      // Extract title and content from the generated text
      const titleMatch = resultado.match(/^(.+?)(?:\r?\n|\r)/);
      let title = titleMatch ? titleMatch[1].trim() : selectedDemanda.titulo || '';
      const content = titleMatch 
        ? resultado.substring(titleMatch[0].length).trim()
        : resultado;
        
      // Remove any markdown formatting from the title (asterisks, etc.)
      title = title.replace(/\*\*/g, '').replace(/\*/g, '');

      return { titulo: title, nota: content };
      
    } catch (error: any) {
      console.error('Erro ao gerar sugestão:', error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao tentar gerar a sugestão de nota.",
        variant: "destructive"
      });
      
      return { titulo: '', nota: '' };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateSuggestion
  };
};
