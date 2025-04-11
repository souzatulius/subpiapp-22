
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type PromptType = 'resumo_solicitacao' | 'nota_imprensa' | 'release' | 'esic';

interface UseGptGenerationProps {
  onSuccess?: (result: string) => void;
}

export const useGptGeneration = ({ onSuccess }: UseGptGenerationProps = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (tipo: PromptType, dados: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Generating ${tipo} content with data:`, dados);
      
      const { data, error } = await supabase.functions.invoke('generate-with-gpt', {
        body: { tipo, dados }
      });
      
      if (error) {
        throw new Error(error.message || 'Erro ao gerar conteúdo');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const result = data.resultado;
      setGeneratedText(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      toast({
        title: "Conteúdo gerado com sucesso",
        description: "O texto foi criado pela IA e está pronto para uso."
      });
      
      return result;
    } catch (err: any) {
      console.error('Erro na geração de conteúdo:', err);
      
      const errorMessage = err.message || 'Ocorreu um erro ao gerar o conteúdo';
      setError(errorMessage);
      
      toast({
        title: "Erro na geração",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating,
    generatedText,
    error,
    reset: () => {
      setGeneratedText(null);
      setError(null);
    }
  };
};
