
import React, { useState } from 'react';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { NotaExistente } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CriarNotaFormProps {
  titulo: string;
  setTitulo: (value: string) => void;
  texto: string;
  setTexto: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  notaExistente: NotaExistente | null;
  demandaInfo?: any;
  perguntasRespostas?: any[];
}

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  onSubmit,
  isPending,
  notaExistente,
  demandaInfo,
  perguntasRespostas = []
}) => {
  const [isGerandoSugestao, setIsGerandoSugestao] = useState(false);

  const handleGerarSugestao = async () => {
    if (!demandaInfo) {
      toast({
        title: "Erro",
        description: "Não há informações suficientes para gerar uma sugestão.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGerandoSugestao(true);
      
      const { data, error } = await supabase.functions.invoke('generate-note-suggestion', {
        body: {
          demandInfo: demandaInfo,
          responses: perguntasRespostas
        }
      });

      if (error) {
        console.error('Erro ao chamar a edge function:', error);
        throw new Error(`Erro ao chamar a Edge Function: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Erro retornado pela edge function:', data.error);
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
              break;
            }
          }
        }
        
        if (suggestedTitle) setTitulo(suggestedTitle);
        setTexto(suggestedContent);
        
        toast({
          title: "Sugestão gerada com sucesso!",
          description: "A sugestão de nota foi gerada e inserida no formulário. Você pode editá-la conforme necessário."
        });
      } else {
        throw new Error("A resposta não contém uma sugestão válida");
      }
    } catch (error: any) {
      console.error('Erro ao gerar sugestão:', error);
      toast({
        title: "Erro ao gerar sugestão",
        description: error.message || "Ocorreu um erro ao tentar gerar a sugestão de nota.",
        variant: "destructive"
      });
    } finally {
      setIsGerandoSugestao(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Criar Nota Oficial</h3>
        
        {notaExistente ? (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700">
              Já existe uma nota oficial criada para esta demanda com o status "{notaExistente.status}".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Título da Nota
                </label>
                <Button
                  onClick={handleGerarSugestao}
                  variant="outline"
                  size="sm"
                  className="text-[#003570] border-[#003570] hover:bg-[#EEF2F8]"
                  disabled={isGerandoSugestao || !demandaInfo}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGerandoSugestao ? "Gerando..." : "Gerar com IA"}
                </Button>
              </div>
              <Input
                id="titulo"
                placeholder="Insira um título para a nota oficial"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                Texto da Nota
              </label>
              <Textarea
                id="texto"
                placeholder="Escreva o conteúdo da nota oficial"
                rows={8}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={onSubmit}
                disabled={isPending}
                className="bg-[#003570] hover:bg-[#002855]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Salvar Nota Oficial
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CriarNotaForm;
