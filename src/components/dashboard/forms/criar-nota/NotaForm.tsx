
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ResponseQA, Demand } from './types';
import { useGptNotaSuggestion } from '@/hooks/dashboard/forms/criar-nota/useGptNotaSuggestion';

interface NotaFormProps {
  titulo: string;
  setTitulo: (titulo: string) => void;
  texto: string;
  setTexto: (texto: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  selectedDemanda?: Demand | null;
  formattedResponses?: ResponseQA[];
  comentarios?: string | null;
}

const NotaForm: React.FC<NotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  handleSubmit,
  isSubmitting,
  selectedDemanda,
  formattedResponses = [],
  comentarios
}) => {
  const { isGenerating, generateSuggestion } = useGptNotaSuggestion();

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
      const { titulo: generatedTitle, nota: generatedContent } = await generateSuggestion(
        selectedDemanda,
        formattedResponses
      );
      
      if (generatedTitle) {
        // Remove any markdown formatting from the title
        const cleanTitle = generatedTitle.replace(/\*\*/g, '').replace(/\*/g, '');
        setTitulo(cleanTitle);
      }
      
      if (generatedContent) {
        setTexto(generatedContent);
        
        toast({
          title: "Sugestão gerada com sucesso!",
          description: "A sugestão de nota foi gerada e inserida no formulário. Você pode editá-la conforme necessário."
        });
      }
    } catch (error: any) {
      console.error('Erro ao processar sugestão gerada:', error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao tentar gerar a sugestão.",
        variant: "destructive"
      });
    }
  };

  const onSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Submit button clicked - calling handleSubmit");
    
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
    
    handleSubmit();
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">      
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <Label htmlFor="titulo">Título da Nota Oficial</Label>
        </div>
        <Button
          variant="outline"
          onClick={handleGenerateSuggestion}
          disabled={isGenerating || !selectedDemanda}
          className="ml-4 text-[#003570] border-[#003570] hover:bg-[#EEF2F8] rounded-xl"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? "Gerando..." : "Gerar sugestão"}
        </Button>
      </div>
      
      <div className="mb-4">
        <Input 
          id="titulo" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          className="rounded-xl"
          required
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="texto" className="mb-2 block">Texto da Nota Oficial</Label>
        <Textarea 
          id="texto" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)} 
          rows={10}
          className="rounded-xl"
          required
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={onSubmitClick}
          disabled={isSubmitting}
          className="bg-[#003570] hover:bg-[#002855] rounded-xl"
        >
          {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
        </Button>
      </div>
    </div>
  );
};

export default NotaForm;
