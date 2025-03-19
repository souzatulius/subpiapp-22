
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ResponseQA, Demand } from './types';

interface NotaFormProps {
  titulo: string;
  setTitulo: (titulo: string) => void;
  texto: string;
  setTexto: (texto: string) => void;
  handleBackToSelection: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  selectedDemanda?: Demand | null;
  formattedResponses?: ResponseQA[];
}

const NotaForm: React.FC<NotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  handleBackToSelection,
  handleSubmit,
  isSubmitting,
  selectedDemanda,
  formattedResponses = []
}) => {
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);

  const handleGenerateSuggestion = async () => {
    if (!selectedDemanda) {
      toast({
        title: "Erro",
        description: "Nenhuma demanda selecionada para gerar sugestão.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingSuggestion(true);
      
      const { data, error } = await supabase.functions.invoke('generate-note-suggestion', {
        body: {
          demandInfo: selectedDemanda,
          responses: formattedResponses
        }
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.suggestion) {
        // Try to extract a title and content from the suggestion
        const lines = data.suggestion.split('\n');
        let suggestedTitle = '';
        let suggestedContent = data.suggestion;
        
        // Check if the first non-empty line could be a title
        for (let i = 0; i < Math.min(5, lines.length); i++) {
          if (lines[i].trim()) {
            // Check if it's likely a title (short, no punctuation at end)
            if (lines[i].length < 100 && !lines[i].endsWith('.')) {
              suggestedTitle = lines[i].replace(/^(título:|titulo:)/i, '').trim();
              suggestedContent = lines.slice(i + 1).join('\n').trim();
            }
            break;
          }
        }
        
        if (suggestedTitle) setTitulo(suggestedTitle);
        setTexto(suggestedContent);
        
        toast({
          title: "Sugestão gerada com sucesso!",
          description: "A sugestão de nota foi gerada e inserida no formulário. Você pode editá-la conforme necessário."
        });
      }
    } catch (error) {
      console.error('Erro ao gerar sugestão:', error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao tentar gerar a sugestão de nota.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleBackToSelection}
        className="mb-2 -ml-2 text-gray-600"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para seleção
      </Button>
      
      <div className="flex justify-between items-center mt-6">
        <div className="flex-1">
          <Label htmlFor="titulo">Título da Nota Oficial</Label>
        </div>
        <Button
          variant="outline"
          onClick={handleGenerateSuggestion}
          disabled={isGeneratingSuggestion || !selectedDemanda}
          className="ml-4 text-[#003570] border-[#003570] hover:bg-[#EEF2F8]"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGeneratingSuggestion ? "Gerando..." : "Gerar sugestão"}
        </Button>
      </div>
      
      <div className="mt-2">
        <Input 
          id="titulo" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="Informe um título claro e objetivo"
        />
      </div>
      
      <div className="mt-4">
        <Label htmlFor="texto">Texto da Nota Oficial</Label>
        <Textarea 
          id="texto" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)} 
          placeholder="Digite o conteúdo da nota oficial..."
          rows={10}
        />
      </div>
      
      <div className="flex justify-end pt-4 mt-4">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#003570] hover:bg-[#002855]"
        >
          {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
        </Button>
      </div>
    </>
  );
};

export default NotaForm;
