
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, SendHorizontal, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Demanda } from '../types';
import RespostaFormHeader from './RespostaFormHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import FormFooter from './FormFooter';

interface RespostaFormProps {
  selectedDemanda: Demanda;
  resposta: Record<string, string>;
  comentarios: string;
  setResposta: (resposta: Record<string, string>) => void;
  setComentarios: (comentarios: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
  handleRespostaChange: (key: string, value: string) => void;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  comentarios,
  setResposta,
  setComentarios,
  onBack,
  isLoading,
  onSubmit,
  handleRespostaChange,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('details');
  const perguntas = selectedDemanda.perguntas || {};
  
  // Check if all questions have been answered
  const normalizedQuestions = React.useMemo(() => 
    normalizeQuestions(selectedDemanda.perguntas || {}),
    [selectedDemanda.perguntas]
  );
  
  const allQuestionsAnswered = React.useMemo(() => {
    if (normalizedQuestions.length === 0) return true;
    
    return normalizedQuestions.every((_, index) => {
      const key = index.toString();
      return resposta[key] && resposta[key].trim() !== '';
    });
  }, [normalizedQuestions, resposta]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost"
          onClick={onBack} 
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <RespostaFormHeader selectedDemanda={selectedDemanda} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="questions">Perguntas</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Detalhes da Solicitação</h2>
                
                {selectedDemanda.detalhes_solicitacao ? (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedDemanda.detalhes_solicitacao}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Nenhum detalhe fornecido para esta solicitação.
                  </p>
                )}
                
                {/* Exibir outras informações relevantes da demanda */}
                {selectedDemanda.protocolo && (
                  <div className="text-sm">
                    <span className="font-medium">Protocolo:</span> {selectedDemanda.protocolo}
                  </div>
                )}
                
                {selectedDemanda.origem_id && selectedDemanda.origens_demandas && (
                  <div className="text-sm">
                    <span className="font-medium">Origem:</span> {selectedDemanda.origens_demandas.descricao}
                  </div>
                )}
                
                {selectedDemanda.prioridade && (
                  <div className="text-sm">
                    <span className="font-medium">Prioridade:</span> {selectedDemanda.prioridade}
                  </div>
                )}
                
                {selectedDemanda.problema && (
                  <div className="text-sm">
                    <span className="font-medium">Área/Tema:</span> {selectedDemanda.problema.descricao}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="pt-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <QuestionsAnswersSection
                perguntas={selectedDemanda.perguntas}
                resposta={resposta}
                onRespostaChange={handleRespostaChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="pt-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <CommentsSection
                comentarios={comentarios}
                onChange={setComentarios}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-4 border-t">
        <FormFooter 
          isLoading={isLoading}
          allQuestionsAnswered={allQuestionsAnswered}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default RespostaForm;
