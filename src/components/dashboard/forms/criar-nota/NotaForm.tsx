
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ResponseQA, Demand } from '@/types/demand';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface NotaFormProps {
  titulo: string;
  setTitulo: (titulo: string) => void;
  texto: string;
  setTexto: (texto: string) => void;
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

      // Handle the new response format with separate titulo and nota fields
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
    <div className="space-y-6">
      {/* Título da Nota */}
      <div className="space-y-2">
        <Label htmlFor="titulo" className="text-base font-medium">Título da Nota</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite o título da nota..."
          className="w-full"
        />
      </div>
      
      {/* Conteúdo da Nota */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="texto" className="text-base font-medium">Conteúdo da Nota</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateSuggestion}
            disabled={isGeneratingSuggestion}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingSuggestion ? 'Gerando...' : 'Gerar Sugestão'}
          </Button>
        </div>
        <Textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite o conteúdo da nota..."
          className="min-h-[300px]"
        />
      </div>
      
      {/* Exibir respostas */}
      {formattedResponses.length > 0 && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-4">Respostas da Demanda</h3>
            <div className="space-y-4">
              {formattedResponses.map((qa, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium text-gray-700">{qa.question}</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">{qa.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Exibir comentários da demanda (se existirem) */}
      {selectedDemanda?.resposta?.comentarios && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-4">Comentários Internos</h3>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <p className="text-gray-600 whitespace-pre-line">
                {selectedDemanda.resposta.comentarios}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Separator />
      
      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-subpi-blue hover:bg-subpi-blue-dark"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Nota'}
        </Button>
      </div>
    </div>
  );
};

export default NotaForm;
