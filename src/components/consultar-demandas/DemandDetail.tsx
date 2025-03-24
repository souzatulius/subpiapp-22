
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Calendar, User, Mail, Phone, MapPin, Building, FileText } from 'lucide-react';
import { type Demand } from '@/hooks/consultar-demandas/types';

interface DemandDetailProps {
  demand: Demand;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const DemandDetail: React.FC<DemandDetailProps> = ({ demand, isOpen, onClose, onEdit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">{demand.titulo}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status and basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {demand.status}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Prioridade</h3>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${demand.prioridade === 'alta' ? 'bg-red-100 text-red-800' : 
                  demand.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                {demand.prioridade === 'alta' ? 'Alta' : 
                 demand.prioridade === 'media' ? 'Média' : 'Baixa'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Origin and Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-500">Problema</h3>
              </div>
              <p>{demand.problema?.descricao || 'Não informado'}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-500">Serviço</h3>
              </div>
              <p>{demand.servico?.descricao || 'Não informado'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-500">Origem</h3>
              </div>
              <p>{demand.origem?.descricao || 'Não informado'}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-500">Data de Criação</h3>
              </div>
              <p>
                {demand.horario_publicacao 
                  ? format(new Date(demand.horario_publicacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                  : 'Não informada'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Requester Info */}
          <div className="space-y-4">
            <h3 className="font-medium">Dados do Solicitante</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-500">Nome</h4>
                </div>
                <p>{demand.nome_solicitante || 'Não informado'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                </div>
                <p>{demand.email_solicitante || 'Não informado'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                </div>
                <p>{demand.telefone_solicitante || 'Não informado'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-500">Endereço</h4>
                </div>
                <p>{demand.endereco || 'Não informado'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details and Questions */}
          {demand.detalhes_solicitacao && (
            <div className="space-y-2">
              <h3 className="font-medium">Detalhes da Solicitação</h3>
              <p className="whitespace-pre-line p-3 bg-gray-50 rounded">{demand.detalhes_solicitacao}</p>
            </div>
          )}

          {demand.perguntas && Object.keys(demand.perguntas).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Perguntas</h3>
              <div className="space-y-3">
                {Object.entries(demand.perguntas).map(([key, question]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded">
                    <p>{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Fechar</Button>
            <Button onClick={onEdit}>Editar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemandDetail;
