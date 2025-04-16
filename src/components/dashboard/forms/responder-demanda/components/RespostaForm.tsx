
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, FileIcon, FileText, FileImage, FileArchive, FileAudio, FileVideo } from 'lucide-react';
import { Demanda } from '../types';
import RespostaFormHeader from './RespostaFormHeader';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import FormFooter from './FormFooter';
import DemandaMetadataSection from './sections/DemandaMetadataSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import { Separator } from '@/components/ui/separator';
import { DemandaStatusBadge, PrioridadeBadge, CoordenacaoBadge, TemaBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  hideBackButton?: boolean;
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
  hideBackButton = false
}) => {
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
  
  // Get coordenacao sigla
  const coordenacaoSigla = selectedDemanda.tema?.coordenacao?.sigla || 
                           selectedDemanda.problema?.coordenacao?.sigla || 
                           (selectedDemanda.coordenacao?.sigla || '');
  
  const renderAttachmentIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <FileImage className="h-12 w-12 text-orange-500" />;
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return <FileAudio className="h-12 w-12 text-orange-500" />;
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension || '')) {
      return <FileVideo className="h-12 w-12 text-orange-500" />;
    } else if (['zip', 'rar', '7z'].includes(extension || '')) {
      return <FileArchive className="h-12 w-12 text-orange-500" />;
    } else if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(extension || '')) {
      return <FileText className="h-12 w-12 text-orange-500" />;
    } else {
      return <FileIcon className="h-12 w-12 text-orange-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header row with back button */}
      <div className="flex items-center justify-between mb-6">
        {!hideBackButton && (
          <Button 
            variant="outline"
            onClick={onBack} 
            className="flex items-center space-x-2 shadow-sm border border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}
      </div>
      
      <div className="p-6 space-y-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Título e tags em uma linha */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-subpi-blue">
            {selectedDemanda.titulo || 'Sem título definido'}
          </h2>
          
          <div className="flex flex-wrap items-center gap-2">
            {selectedDemanda.tema && (
              <TemaBadge texto={selectedDemanda.tema.descricao || 'Tema não definido'} />
            )}
            
            <PrioridadeBadge 
              prioridade={selectedDemanda.prioridade} 
              size="sm"
            />
            
            <DemandaStatusBadge 
              status={selectedDemanda.status} 
              size="sm" 
              showIcon={true} 
            />
            
            {coordenacaoSigla && (
              <CoordenacaoBadge texto={coordenacaoSigla} size="sm" />
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Criado em {' '}
          {format(new Date(selectedDemanda.horario_publicacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
        
        <Separator />
        
        {/* Seção de metadados da demanda */}
        <DemandaMetadataSection selectedDemanda={selectedDemanda} />
        
        <Separator />
        
        {/* Seção de anexos */}
        {selectedDemanda.anexos && selectedDemanda.anexos.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-subpi-blue">Anexos</h3>
            <div className="flex flex-wrap gap-6">
              {selectedDemanda.anexos.map((anexo, index) => {
                const filename = typeof anexo === 'string' 
                  ? anexo.split('/').pop() || `Anexo ${index + 1}` 
                  : `Anexo ${index + 1}`;
                
                return (
                  <a 
                    key={index} 
                    href={typeof anexo === 'string' ? anexo : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center transition-transform hover:scale-105"
                  >
                    {renderAttachmentIcon(filename)}
                    <span className="text-sm text-gray-600 mt-1 text-center max-w-[120px] truncate">
                      {filename}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Primeiro exibir o resumo da situação se existir, caso contrário exibir detalhes_solicitacao */}
        {selectedDemanda.resumo_situacao ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-subpi-blue">Resumo</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedDemanda.resumo_situacao}
              </p>
            </div>
          </div>
        ) : selectedDemanda.detalhes_solicitacao ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-subpi-blue">Detalhes da Solicitação</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedDemanda.detalhes_solicitacao}
              </p>
            </div>
          </div>
        ) : null}
        
        <Separator />
        
        {/* Seção de perguntas e respostas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-subpi-blue">Perguntas e Respostas</h3>
          <QuestionsAnswersSection
            perguntas={selectedDemanda.perguntas}
            resposta={resposta}
            onRespostaChange={handleRespostaChange}
          />
        </div>
        
        <Separator />
        
        {/* Seção de comentários - sem placeholder e sem mensagem explicativa */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-subpi-blue">Comentários Internos</h3>
          <CommentsSection
            comentarios={comentarios}
            onChange={setComentarios}
            showHelpText={false}
          />
        </div>
      </div>
      
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
