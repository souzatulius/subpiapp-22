
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TemaSelector from './TemaSelector';
import ServicoSelector from './ServicoSelector';
import DemandaInfoSection from './DemandaInfoSection';
import DemandaDetailsSection from './DemandaDetailsSection';
import AttachmentsSection from './AttachmentsSection';
import { Checkbox } from '@/components/ui/checkbox';

interface DetailsTabProps {
  selectedDemanda: any;
  selectedProblemId: string;
  selectedServicoId: string;
  dontKnowService: boolean;
  problems: any[];
  problemsLoading: boolean;
  servicos: any[];
  servicosLoading: boolean;
  currentProblem: any;
  onProblemChange: (id: string) => void;
  onServicoChange: (id: string) => void;
  onDontKnowServiceChange: () => void;
  onViewAttachment: (url: string) => void;
  onDownloadAttachment: (url: string) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  selectedDemanda,
  selectedProblemId,
  selectedServicoId,
  dontKnowService,
  problems,
  problemsLoading,
  servicos,
  servicosLoading,
  currentProblem,
  onProblemChange,
  onServicoChange,
  onDontKnowServiceChange,
  onViewAttachment,
  onDownloadAttachment
}) => {
  return (
    <TabsContent value="details" className="pt-2 m-0 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Informações da demanda, tema, serviço e anexos */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-subpi-blue">Tema</h3>
            <TemaSelector 
              selectedProblemId={selectedProblemId}
              problems={problems}
              problemsLoading={problemsLoading}
              demandaId={selectedDemanda.id}
              currentProblem={currentProblem}
              onProblemChange={onProblemChange}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-subpi-blue">Serviço</h3>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox 
                id="nao-sabe-servico" 
                checked={dontKnowService} 
                onCheckedChange={onDontKnowServiceChange}
                className="data-[state=checked]:bg-subpi-blue data-[state=checked]:border-subpi-blue"
              />
              <label 
                htmlFor="nao-sabe-servico" 
                className="text-sm text-gray-700 cursor-pointer hover:text-subpi-blue transition-colors duration-300"
              >
                Não sei informar o serviço
              </label>
            </div>
            
            {!dontKnowService && (
              <ServicoSelector 
                selectedServicoId={selectedServicoId}
                servicos={servicos}
                servicosLoading={servicosLoading}
                onServicoChange={onServicoChange}
              />
            )}
          </div>

          <Separator className="my-4" />
          
          <DemandaInfoSection demanda={selectedDemanda} />
          
          <AttachmentsSection 
            arquivo_url={selectedDemanda.arquivo_url} 
            anexos={selectedDemanda.anexos}
            onViewAttachment={onViewAttachment}
            onDownloadAttachment={onDownloadAttachment}
          />
        </div>
        
        {/* Coluna 2: Detalhes da solicitação (spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-50 border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <DemandaDetailsSection detalhes={selectedDemanda.detalhes_solicitacao} />
            </CardContent>
          </Card>
          
          {/* Informações do solicitante */}
          {(selectedDemanda.nome_solicitante || selectedDemanda.email_solicitante || selectedDemanda.telefone_solicitante) && (
            <div className="animate-fade-in">
              <h3 className="text-base font-medium text-subpi-blue mb-3">Informações do Solicitante</h3>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2 hover:bg-blue-100/50 transition-colors duration-300">
                {selectedDemanda.nome_solicitante && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Nome:</span>
                    <span className="text-sm ml-2 text-blue-900">{selectedDemanda.nome_solicitante}</span>
                  </div>
                )}
                
                {selectedDemanda.email_solicitante && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Email:</span>
                    <span className="text-sm ml-2 text-blue-900">{selectedDemanda.email_solicitante}</span>
                  </div>
                )}
                
                {selectedDemanda.telefone_solicitante && (
                  <div>
                    <span className="text-sm font-medium text-blue-700">Telefone:</span>
                    <span className="text-sm ml-2 text-blue-900">{selectedDemanda.telefone_solicitante}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default DetailsTab;
