import React from 'react';
import DetailsTab from './DetailsTab';
import CommentsTab from './CommentsTab';
import QuestionsTab from './QuestionsTab';

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

// This component is kept for backward compatibility, but is now just a pass-through
// since we've consolidated all the content into the single RespostaForm view
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
    <div className="w-full">
      {/* Content is now all in the main RespostaForm component */}
      {/* This component is maintained for backward compatibility */}
      {activeTab === 'details' && (
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
      )}
      
      {activeTab === 'comments' && (
        <CommentsTab 
          comentarios={comentarios}
          onChange={onComentariosChange}
        />
      )}
    </div>
  );
};

export default TabsNavigation;
