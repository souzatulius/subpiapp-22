
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useProblemsData } from '@/hooks/problems';
import { useServicosData } from '@/hooks/demandForm/useServicosData';
import { Separator } from '@/components/ui/separator';

// Import sub-components
import DemandaHeader from './DemandaHeader';
import TemaSelector from './TemaSelector';
import ServicoSelector from './ServicoSelector';
import DemandaInfoSection from './DemandaInfoSection';
import DemandaDetailsSection from './DemandaDetailsSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';

interface RespostaFormProps {
  selectedDemanda: any;
  resposta: Record<string, string>;
  setResposta: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
  comentarios?: string;
  setComentarios?: React.Dispatch<React.SetStateAction<string>>;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  onBack,
  isLoading,
  onSubmit,
  comentarios = '',
  setComentarios
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [selectedServicoId, setSelectedServicoId] = useState<string>('');
  const [localComentarios, setLocalComentarios] = useState<string>(comentarios);
  
  const { problems, isLoading: problemsLoading } = useProblemsData();
  const { servicos, isLoading: servicosLoading } = useServicosData();

  useEffect(() => {
    if (setComentarios) {
      setComentarios(localComentarios);
    }
  }, [localComentarios, setComentarios]);

  useEffect(() => {
    if (selectedDemanda?.problema_id) {
      setSelectedProblemId(selectedDemanda.problema_id);
    }
    
    if (selectedDemanda?.perguntas) {
      const initialRespostas: Record<string, string> = {};
      
      if (Array.isArray(selectedDemanda.perguntas)) {
        selectedDemanda.perguntas.forEach((pergunta: string, index: number) => {
          initialRespostas[index.toString()] = resposta[index.toString()] || '';
        });
      } else if (typeof selectedDemanda.perguntas === 'object') {
        Object.keys(selectedDemanda.perguntas).forEach((key) => {
          initialRespostas[key] = resposta[key] || '';
        });
      }
      
      setResposta(initialRespostas);
    }

    // Inicializar o serviço selecionado
    if (selectedDemanda?.servico_id) {
      setSelectedServicoId(selectedDemanda.servico_id);
    }
  }, [selectedDemanda, setResposta, resposta]);

  // Handle form input changes
  const handleRespostaChange = (key: string, value: string) => {
    setResposta(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmitWithExtra = async () => {
    try {
      // Atualizar o serviço selecionado (se houver)
      if (selectedServicoId && selectedServicoId !== selectedDemanda.servico_id) {
        const updatePayload: any = { servico_id: selectedServicoId };
        
        const { error: servicoError } = await supabase
          .from('demandas')
          .update(updatePayload)
          .eq('id', selectedDemanda.id);
          
        if (servicoError) throw servicoError;
      }
      
      // Chamar o onSubmit original que salva as respostas
      await onSubmit();
      
    } catch (error) {
      console.error('Erro ao salvar informações adicionais:', error);
    }
  };
  
  const allQuestionsAnswered = () => {
    if (!selectedDemanda?.perguntas) return true;
    
    const questions = Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas 
      : Object.values(selectedDemanda.perguntas);
      
    const answers = Object.values(resposta);
    
    // Se não tiver perguntas, considera que está tudo respondido
    if (questions.length === 0) return true;
    
    // Verifica se tem o mesmo número de respostas e perguntas
    if (Object.keys(resposta).length !== (Array.isArray(selectedDemanda.perguntas) 
      ? selectedDemanda.perguntas.length 
      : Object.keys(selectedDemanda.perguntas).length)) return false;
    
    // Verifica se todas as respostas estão preenchidas
    return !Object.values(resposta).some(answer => !answer || answer.trim() === '');
  };

  // Find the current theme/problem
  const currentProblem = problems.find(p => p.id === selectedProblemId);

  if (!selectedDemanda) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="mr-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
        <h2 className="text-lg font-semibold">Responder Demanda</h2>
      </div>
      
      <Card>
        <CardHeader>
          <DemandaHeader demanda={selectedDemanda} />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Layout com duas colunas para desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Informações da demanda e detalhes */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Tema</h3>
                <TemaSelector 
                  selectedProblemId={selectedProblemId}
                  problems={problems}
                  problemsLoading={problemsLoading}
                  demandaId={selectedDemanda.id}
                  currentProblem={currentProblem}
                  onProblemChange={setSelectedProblemId}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Serviço</h3>
                <ServicoSelector 
                  selectedServicoId={selectedServicoId}
                  servicos={servicos}
                  servicosLoading={servicosLoading}
                  onServicoChange={setSelectedServicoId}
                />
              </div>

              <Separator className="my-4" />
              
              <DemandaInfoSection demanda={selectedDemanda} />
            </div>
            
            {/* Coluna 2: Detalhes e perguntas/respostas (spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <DemandaDetailsSection detalhes={selectedDemanda.detalhes_solicitacao} />
                </CardContent>
              </Card>
              
              {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 && (
                <QuestionsAnswersSection 
                  perguntas={selectedDemanda.perguntas}
                  resposta={resposta}
                  onRespostaChange={handleRespostaChange}
                />
              )}
              
              <CommentsSection 
                comentarios={setComentarios ? comentarios : localComentarios}
                onChange={(value) => {
                  if (setComentarios) {
                    setComentarios(value);
                  } else {
                    setLocalComentarios(value);
                  }
                }}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 justify-end">
          <Button 
            onClick={handleSubmitWithExtra}
            disabled={isLoading || !allQuestionsAnswered()}
            className="space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar Resposta</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RespostaForm;
