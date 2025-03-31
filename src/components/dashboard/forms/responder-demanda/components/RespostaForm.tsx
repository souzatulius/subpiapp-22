
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DetalheDemanda from './DetalheDemanda';
import { DemandaComDetalhes } from '../types';
import DemandaReplyAlert from './DemandaReplyAlert';

interface RespostaFormProps {
  selectedDemanda: DemandaComDetalhes;
  resposta: string;
  setResposta: (resposta: string) => void;
  comentarios: string;
  setComentarios: (comentarios: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onSubmit: () => void;
  handleRespostaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  hideBackButton?: boolean;
}

const RespostaForm: React.FC<RespostaFormProps> = ({
  selectedDemanda,
  resposta,
  setResposta,
  comentarios,
  setComentarios,
  onBack,
  isLoading,
  onSubmit,
  handleRespostaChange,
  hideBackButton = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('detalhes');
  
  if (!selectedDemanda) {
    return <div>Selecione uma demanda para responder</div>;
  }

  return (
    <div className="space-y-6 animate-in animate-fade-in">
      {!hideBackButton && (
        <Button 
          variant="ghost" 
          className="mb-2 flex gap-2 items-center" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
      )}
      
      <Tabs defaultValue="detalhes" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="detalhes">Detalhes da Demanda</TabsTrigger>
          <TabsTrigger value="resposta">Responder Demanda</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalhes" className="space-y-4">
          <DetalheDemanda demanda={selectedDemanda} />
          <div className="pt-4 flex justify-end">
            <Button 
              onClick={() => setActiveTab('resposta')}
            >
              Responder Demanda
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="resposta" className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">{selectedDemanda.titulo}</h4>
              <p className="text-sm text-gray-600">{selectedDemanda.detalhes_solicitacao}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resposta">Resposta</Label>
              <DemandaReplyAlert demanda={selectedDemanda} />
              <Textarea
                id="resposta"
                value={resposta}
                onChange={handleRespostaChange}
                placeholder="Escreva a resposta para a demanda..."
                className="min-h-[200px] rounded-md"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comentarios">Comentários Internos</Label>
              <Textarea
                id="comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Adicione comentários internos (opcional)"
                className="min-h-[100px] rounded-md"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab('detalhes')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Detalhes
              </Button>
              
              <Button 
                onClick={onSubmit} 
                disabled={isLoading || !resposta.trim()} 
                className="text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Resposta
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RespostaForm;
