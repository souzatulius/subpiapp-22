
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTab from './DetailsTab';
import CommentsTab from './CommentsTab';

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  comentarios: string;
  onComentariosChange: (value: string) => void;
  selectedDemanda: any;
  resposta: Record<string, string>;
  onRespostaChange: (key: string, value: string) => void;
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

const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  comentarios,
  onComentariosChange,
  selectedDemanda,
  resposta,
  onRespostaChange,
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
    <Tabs 
      defaultValue="details" 
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full lg:w-auto mb-4 bg-gray-100">
        <TabsTrigger 
          value="details" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-subpi-blue transition-all duration-300"
        >
          Detalhes da Demanda
        </TabsTrigger>
        <TabsTrigger 
          value="comments" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-subpi-blue transition-all duration-300"
        >
          Comentários
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="pt-2 m-0 animate-fade-in">
        <DetailsTab 
          selectedDemanda={selectedDemanda}
          selectedProblemId={selectedProblemId}
          selectedServicoId={selectedServicoId}
          dontKnowService={dontKnowService}
          problems={problems}
          problemsLoading={problemsLoading}
          servicos={servicos}
          servicosLoading={servicosLoading}
          currentProblem={currentProblem}
          onProblemChange={onProblemChange}
          onServicoChange={onServicoChange}
          onDontKnowServiceChange={onDontKnowServiceChange}
          onViewAttachment={onViewAttachment}
          onDownloadAttachment={onDownloadAttachment}
          resposta={resposta}
          onRespostaChange={onRespostaChange}
        />
      </TabsContent>
      
      <TabsContent value="comments" className="pt-2 m-0 animate-fade-in">
        <CommentsTab 
          comentarios={comentarios}
          onChange={onComentariosChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsNavigation;
