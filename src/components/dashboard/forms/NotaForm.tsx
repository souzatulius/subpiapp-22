
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useReleaseForm, ReleaseFormValues } from '@/hooks/useReleaseForm';
import { Demand } from '@/hooks/consultar-demandas/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotaFormProps {
  titulo: string;
  setTitulo: (titulo: string) => void;
  texto: string;
  setTexto: (texto: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  selectedDemanda?: Demand | null;
  formattedResponses?: any[];
}

const NotaForm: React.FC<NotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  handleSubmit,
  isSubmitting,
  selectedDemanda,
  formattedResponses = []
}) => {
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const { submitRelease } = useReleaseForm();

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
      
      // Get current date formatted in Portuguese
      const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      
      // Prepare problem summary from demand title
      const problemSummary = selectedDemanda.titulo || '';
      
      // Prepare location information
      const location = selectedDemanda.bairro?.nome || selectedDemanda.endereco || 'Região de Pinheiros';
      
      // Get demand theme/area
      const theme = selectedDemanda.supervisao_tecnica?.descricao || selectedDemanda.area_coordenacao?.descricao || '';
      
      // Get deadline and status
      const deadline = selectedDemanda.prazo_resposta 
        ? format(new Date(selectedDemanda.prazo_resposta), "dd/MM/yyyy", { locale: ptBR })
        : 'Não informado';
      
      const status = selectedDemanda.status || 'Em andamento';
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-note-suggestion', {
          body: {
            demandInfo: {
              ...selectedDemanda,
              problemSummary,
              location,
              theme,
              deadline,
              status,
              currentDate
            },
            responses: formattedResponses
          }
        });

        if (error) throw error;
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Handle the response with separate titulo and nota fields
        if (data.titulo && data.nota) {
          // Set title and note content from the response
          setTitulo(data.titulo);
          setTexto(data.nota);
          
          toast({
            title: "Sugestão gerada com sucesso!",
            description: "A sugestão de nota foi gerada e inserida no formulário. Você pode editá-la conforme necessário."
          });
        } else {
          // Handle legacy format or unexpected response format
          if (data.suggestion) {
            // Legacy format - set content from the generated suggestion
            if (!titulo && problemSummary) {
              setTitulo(problemSummary);
            }
            setTexto(data.suggestion);
            
            toast({
              title: "Sugestão gerada com sucesso!",
              description: "A sugestão de nota foi gerada e inserida no formulário. Você pode editá-la conforme necessário."
            });
          } else {
            throw new Error("Formato de resposta inválido");
          }
        }
      } catch (e) {
        console.error("Error invoking function:", e);
        toast({
          title: "Erro ao gerar sugestão",
          description: "Não foi possível gerar a sugestão de nota. Tente novamente mais tarde.",
          variant: "destructive"
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
          className="rounded-lg"
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
          className="rounded-lg"
        />
      </div>
      
      <div className="flex justify-end pt-4 mt-4">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#003570] hover:bg-[#002855] rounded-lg"
        >
          {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
        </Button>
      </div>
    </>
  );
};

export default NotaForm;
