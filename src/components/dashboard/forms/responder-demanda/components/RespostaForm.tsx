
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
  
  // Get coordenacao sigla
  const coordenacaoSigla = selectedDemanda.tema?.coordenacao?.sigla || 
                           selectedDemanda.problema?.coordenacao?.sigla || 
                           (selectedDemanda.coordenacao?.sigla || '');
  
  return (
    <div className="space-y-6">
      {/* Header row with back button, title, and tags */}
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
        
        <h2 className="text-2xl font-semibold text-subpi-blue text-center flex-grow">
          {selectedDemanda.titulo || 'Sem título definido'}
        </h2>
        
        <div className="flex items-center gap-2">
          {selectedDemanda.tema && (
            <Badge size="sm" className="px-3 py-1 flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              {selectedDemanda.tema.descricao || 'Tema não definido'}
            </Badge>
          )}
          
          <Badge size="sm" className={`px-3 py-1 rounded-full ${
            selectedDemanda.prioridade === 'alta' 
              ? 'bg-orange-50 text-orange-700 border border-orange-200' 
              : selectedDemanda.prioridade === 'media' 
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                : 'bg-green-50 text-green-700 border border-green-200'}`}
          >
            {formatarPrioridade(selectedDemanda.prioridade)}
          </Badge>
          
          <DemandaStatusBadge 
            status={selectedDemanda.status} 
            size="sm"
            className="px-2.5 py-0.5"
            showIcon={true} 
          />
          
          {coordenacaoSigla && (
            <Badge size="sm" className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5 rounded-full">
              {coordenacaoSigla}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-8 bg-white rounded-xl border border-gray-200 shadow-sm">        
        <div className="text-sm text-gray-600">
          Criado por <span className="font-medium">{selectedDemanda.autor?.nome_completo}</span> em {' '}
          {format(new Date(selectedDemanda.horario_publicacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
        
        <Separator />
        
        {/* Seção de metadados da demanda */}
        <DemandaMetadataSection selectedDemanda={selectedDemanda} />
        
        <Separator />
        
        {/* Seção de anexos */}
        {selectedDemanda.anexos && selectedDemanda.anexos.length > 0 && (
          <div className="flex flex-wrap gap-6 justify-center">
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
                  className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
                >
                  {renderAttachmentIcon(filename)}
                  <span className="max-w-[150px] truncate text-sm text-gray-600">{filename}</span>
                </a>
              );
            })}
          </div>
        )}
        
        {/* Seção de resumo (substitui detalhes) */}
        {selectedDemanda.detalhes_solicitacao && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-subpi-blue">Resumo</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
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
