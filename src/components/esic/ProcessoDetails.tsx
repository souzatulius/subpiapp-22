
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ESICProcesso, ESICJustificativa, statusLabels, situacaoLabels } from '@/types/esic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Pencil, 
  FileText, 
  ArrowLeft, 
  Clock, 
  User, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  Sparkles 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProcessoDetailsProps {
  processo: ESICProcesso;
  justificativas: ESICJustificativa[] | undefined;
  onBack: () => void;
  onEdit: (processo: ESICProcesso) => void;
  onAddJustificativa: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateSituacao: (situacao: string) => void;
  isJustificativasLoading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'novo_processo':
      return 'bg-blue-100 text-blue-800';
    case 'aguardando_justificativa':
      return 'bg-yellow-100 text-yellow-800';
    case 'aguardando_aprovacao':
      return 'bg-purple-100 text-purple-800';
    case 'concluido':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSituacaoColor = (situacao: string) => {
  switch (situacao) {
    case 'em_tramitacao':
      return 'bg-orange-100 text-orange-800';
    case 'prazo_prorrogado':
      return 'bg-red-100 text-red-800';
    case 'concluido':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ProcessoDetails: React.FC<ProcessoDetailsProps> = ({ 
  processo, 
  justificativas,
  onBack,
  onEdit, 
  onAddJustificativa,
  onUpdateStatus,
  onUpdateSituacao,
  isJustificativasLoading
}) => {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showSituacaoDialog, setShowSituacaoDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-0 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(processo)}
            className="rounded-full"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar Processo
          </Button>
          
          {(processo.status === 'novo_processo' || processo.status === 'aguardando_justificativa') && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onAddJustificativa}
              className="rounded-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Adicionar Justificativa
            </Button>
          )}
        </div>
      </div>
      
      <Card className="w-full rounded-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>
              Processo de {format(new Date(processo.data_processo), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-2">
              <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <AlertDialogTrigger asChild>
                  <Badge 
                    className={`${getStatusColor(processo.status)} cursor-pointer hover:opacity-80 rounded-full`}
                  >
                    {statusLabels[processo.status]}
                  </Badge>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Alterar Status</AlertDialogTitle>
                    <AlertDialogDescription>
                      Selecione o novo status para este processo:
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className={`rounded-xl ${key === processo.status ? 'border-2 border-primary' : ''}`}
                        onClick={() => {
                          onUpdateStatus(key);
                          setShowStatusDialog(false);
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog open={showSituacaoDialog} onOpenChange={setShowSituacaoDialog}>
                <AlertDialogTrigger asChild>
                  <Badge 
                    className={`${getSituacaoColor(processo.situacao)} cursor-pointer hover:opacity-80 rounded-full`}
                  >
                    {situacaoLabels[processo.situacao]}
                  </Badge>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Alterar Situação</AlertDialogTitle>
                    <AlertDialogDescription>
                      Selecione a nova situação para este processo:
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {Object.entries(situacaoLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className={`rounded-xl ${key === processo.situacao ? 'border-2 border-primary' : ''}`}
                        onClick={() => {
                          onUpdateSituacao(key);
                          setShowSituacaoDialog(false);
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Criado por: {processo.autor?.nome_completo || 'Usuário'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {format(new Date(processo.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Descrição do Processo:</h3>
              <p className="text-gray-700 whitespace-pre-line">{processo.texto}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Justificativas:</h3>
              {isJustificativasLoading ? (
                <p className="text-gray-500 italic">Carregando justificativas...</p>
              ) : justificativas && justificativas.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {justificativas.map((justificativa) => (
                      <Card key={justificativa.id} className="bg-gray-50 rounded-xl">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">{justificativa.autor?.nome_completo || 'Usuário'}</span> - {' '}
                              {format(new Date(justificativa.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                            {justificativa.gerado_por_ia && (
                              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 rounded-full">
                                <Sparkles className="h-3 w-3 mr-1" /> 
                                Gerado por IA
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 whitespace-pre-line">{justificativa.texto}</p>
                        </CardContent>
                        {processo.status === 'aguardando_aprovacao' && (
                          <CardFooter className="pt-0 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 hover:bg-green-50 rounded-full"
                              onClick={() => {
                                onUpdateStatus('concluido');
                                onUpdateSituacao('concluido');
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50 rounded-full"
                              onClick={() => onUpdateStatus('aguardando_justificativa')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Recusar
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500">
                    Nenhuma justificativa encontrada para este processo.
                  </p>
                  {(processo.status === 'novo_processo' || processo.status === 'aguardando_justificativa') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 rounded-full"
                      onClick={onAddJustificativa}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Adicionar Justificativa
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessoDetails;
