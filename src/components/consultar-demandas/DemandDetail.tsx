
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, User, MapPin, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demand } from '@/hooks/consultar-demandas';

export interface DemandDetailProps {
  demand: Demand;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const DemandDetail: React.FC<DemandDetailProps> = ({
  demand,
  isOpen,
  onClose,
  onEdit
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Nova</Badge>;
      case 'em_andamento':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Aguardando Respostas</Badge>;
      case 'respondida':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Respondida</Badge>;
      case 'nota_criada':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Nota Criada</Badge>;
      case 'nota_aprovada':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Nota Aprovada</Badge>;
      case 'nota_rejeitada':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Nota Rejeitada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{demand.titulo}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {demand.nome_solicitante || 'Não informado'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {demand.horario_publicacao 
                  ? format(new Date(demand.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })
                  : 'Data não disponível'}
              </span>
            </div>
            
            <div>{getStatusBadge(demand.status)}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Problema</h4>
              <p>{demand.problema?.descricao || 'Não informado'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Serviço</h4>
              <p>{demand.servico?.descricao || 'Não informado'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Origem</h4>
              <p>{demand.origem?.descricao || 'Não informada'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Prioridade</h4>
              <p className="capitalize">{demand.prioridade}</p>
            </div>
            
            {demand.endereco && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </h4>
                <p>{demand.endereco}</p>
              </div>
            )}
          </div>
          
          {demand.detalhes_solicitacao && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Detalhes da Solicitação
              </h4>
              <p className="whitespace-pre-line text-sm mt-1 bg-gray-50 p-3 rounded-md">
                {demand.detalhes_solicitacao}
              </p>
            </div>
          )}
          
          {demand.perguntas && typeof demand.perguntas === 'object' && Object.keys(demand.perguntas).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                Perguntas
              </h4>
              <div className="space-y-2 mt-2">
                {Object.entries(demand.perguntas).map(([key, question]) => (
                  <div key={key} className="text-sm bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {demand.arquivo_url && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Arquivo Anexado</h4>
              <a 
                href={demand.arquivo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-1"
              >
                <span>Visualizar arquivo</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemandDetail;
