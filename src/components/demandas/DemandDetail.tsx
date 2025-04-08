
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { normalizeQuestions } from '@/utils/questionFormatUtils';
import { Demand, DemandResponse } from '@/hooks/consultar-demandas/types';

interface DemandDetailProps {
  demand: Demand;
  isOpen: boolean;
  onClose: () => void;
  onRespond?: () => void;
}

const DemandDetail: React.FC<DemandDetailProps> = ({ 
  demand, 
  isOpen, 
  onClose,
  onRespond
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
      case 'pendente_resposta':
        return <Badge className="bg-yellow-400 hover:bg-yellow-500">Pendente</Badge>;
      case 'em_andamento':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderQuestions = () => {
    if (!demand.perguntas) return <p className="text-gray-500">Não há perguntas registradas.</p>;
    
    const questions = normalizeQuestions(demand.perguntas);
    const demandResponse = demand.resposta as DemandResponse | undefined;
    const answers = demandResponse?.respostas || {};
    
    return (
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div key={index} className="border rounded-md p-3">
            <p className="font-medium mb-1">{question}</p>
            {demandResponse ? (
              <p className="text-gray-700">{answers[index.toString()] || 'Sem resposta'}</p>
            ) : (
              <p className="text-yellow-600 italic">Aguardando resposta</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center gap-2">
            <span>{demand.titulo}</span>
            {getStatusBadge(demand.status)}
          </DialogTitle>
          <DialogDescription>
            ID: {demand.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Metadados da demanda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data de Criação</p>
              <p className="font-medium">{formatDate(demand.horario_publicacao)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prazo de Resposta</p>
              <p className="font-medium">{formatDate(demand.prazo_resposta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prioridade</p>
              <p className="font-medium capitalize">{demand.prioridade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Área Responsável</p>
              <p className="font-medium">
                {demand.area_coordenacao?.descricao || 'Não informada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Origem</p>
              <p className="font-medium">
                {demand.origem?.descricao || 'Não informada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo de Mídia</p>
              <p className="font-medium">
                {demand.tipo_midia?.descricao || 'Não informado'}
              </p>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t my-4"></div>

          {/* Detalhes do solicitante */}
          <div>
            <h3 className="text-lg font-medium mb-3">Dados do Solicitante</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{demand.nome_solicitante || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium">{demand.email_solicitante || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{demand.telefone_solicitante || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Veículo</p>
                <p className="font-medium">{demand.veiculo_imprensa || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Detalhes da localização */}
          {(demand.endereco || demand.bairro) && (
            <>
              <div className="border-t my-4"></div>
              <div>
                <h3 className="text-lg font-medium mb-3">Localização</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demand.endereco && (
                    <div>
                      <p className="text-sm text-gray-500">Endereço</p>
                      <p className="font-medium">{demand.endereco}</p>
                    </div>
                  )}
                  {demand.bairro && (
                    <div>
                      <p className="text-sm text-gray-500">Bairro</p>
                      <p className="font-medium">{demand.bairro.nome}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Detalhes da solicitação */}
          {demand.detalhes_solicitacao && (
            <>
              <div className="border-t my-4"></div>
              <div>
                <h3 className="text-lg font-medium mb-3">Detalhes da Solicitação</h3>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="whitespace-pre-line">{demand.detalhes_solicitacao}</p>
                </div>
              </div>
            </>
          )}

          {/* Perguntas e Respostas */}
          <div className="border-t my-4"></div>
          <div>
            <h3 className="text-lg font-medium mb-3">Perguntas e Respostas</h3>
            {renderQuestions()}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          
          {onRespond && demand.status === 'pendente_resposta' && (
            <Button onClick={onRespond}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Responder
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemandDetail;
