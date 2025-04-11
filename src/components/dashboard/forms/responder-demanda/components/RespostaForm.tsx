
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Paperclip, FileIcon, FileText, FileImage, FileArchive, FileAudio, FileVideo } from 'lucide-react';
import { Demanda } from '../types';
import RespostaFormHeader from './RespostaFormHeader';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import FormFooter from './FormFooter';
import DemandaMetadataSection from './sections/DemandaMetadataSection';
import QuestionsAnswersSection from './QuestionsAnswersSection';
import CommentsSection from './CommentsSection';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
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
  
  const formatarPrioridade = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return prioridade;
    }
  };
  
  const renderAttachmentIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <FileImage className="h-4 w-4" />;
    } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
      return <FileAudio className="h-4 w-4" />;
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension || '')) {
      return <FileVideo className="h-4 w-4" />;
    } else if (['zip', 'rar', '7z'].includes(extension || '')) {
      return <FileArchive className="h-4 w-4" />;
    } else if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(extension || '')) {
      return <FileText className="h-4 w-4" />;
    } else {
      return <FileIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Back button (only if not hidden) */}
      {!hideBackButton && (
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
      )}
      
      <div className="p-6 space-y-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Tags e informações iniciais */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-subpi-blue">{selectedDemanda.titulo || 'Sem título definido'}</h2>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {selectedDemanda.tema && (
              <Badge className="px-4 py-1.5 flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                {selectedDemanda.tema.descricao || 'Tema não definido'}
              </Badge>
            )}
            
            <Badge className={`px-4 py-1.5 rounded-full ${
              selectedDemanda.prioridade === 'alta' 
                ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                : selectedDemanda.prioridade === 'media' 
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'}`}
            >
              Prioridade: {formatarPrioridade(selectedDemanda.prioridade)}
            </Badge>
            
            <DemandaStatusBadge 
              status={selectedDemanda.status} 
              className="px-4 py-1.5"
              showIcon={true} 
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Criado por <span className="font-medium">{selectedDemanda.autor?.nome_completo}</span> em {' '}
            {format(new Date(selectedDemanda.horario_publicacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
        
        <Separator />
        
        {/* Seção de metadados da demanda */}
        <DemandaMetadataSection selectedDemanda={selectedDemanda} />
        
        <Separator />
        
        {/* Seção de anexos */}
        {selectedDemanda.anexos && selectedDemanda.anexos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-subpi-blue">Anexos</h3>
            <div className="flex flex-wrap gap-3">
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
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors p-2 rounded-md border border-gray-200 text-sm"
                  >
                    {renderAttachmentIcon(filename)}
                    <span className="max-w-[150px] truncate">{filename}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Seção de resumo (substitui detalhes) */}
        {selectedDemanda.detalhes_solicitacao && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-subpi-blue">Resumo</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedDemanda.detalhes_solicitacao}
              </p>
            </div>
          </div>
        )}
        
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
