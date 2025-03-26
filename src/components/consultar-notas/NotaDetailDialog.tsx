
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, User, Calendar, Clock, FileText, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NotaOficial } from '@/types/nota';

interface NotaDetailDialogProps {
  nota: NotaOficial;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (dateStr: string) => string;
}

const NotaDetailDialog: React.FC<NotaDetailDialogProps> = ({ 
  nota, 
  isOpen, 
  onClose,
  formatDate 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <span>{nota.titulo}</span>
            <DialogClose asChild>
              <Button variant="ghost" className="p-1 h-auto">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <Card className="p-4 bg-gray-50 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Informações da Nota</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Autor:</span>
                <span>{nota.autor?.nome_completo || 'Não informado'}</span>
              </div>
              
              {nota.aprovador && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Aprovador:</span>
                  <span>{nota.aprovador.nome_completo}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Data de criação:</span>
                <span>{formatDate(nota.criado_em)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Última atualização:</span>
                <span>{formatDate(nota.atualizado_em)}</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gray-50 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
            
            <div className="space-y-2">
              <div className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center
                ${nota.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                ${nota.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${nota.status === 'rascunho' ? 'bg-gray-100 text-gray-800' : ''}
                ${nota.status === 'publicado' ? 'bg-blue-100 text-blue-800' : ''}
                ${nota.status === 'rejeitado' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
              </div>
              
              {nota.demanda_id && (
                <p className="text-sm text-gray-600 mt-2">
                  Esta nota oficial foi criada a partir de uma demanda da imprensa.
                </p>
              )}
            </div>
          </Card>
        </div>
        
        <div className="my-4">
          <h4 className="text-base font-medium text-gray-700 mb-2">Conteúdo</h4>
          <Card className="p-4 border border-gray-200">
            <div className="text-sm whitespace-pre-line">{nota.texto}</div>
          </Card>
        </div>
        
        {nota.historico_edicoes && nota.historico_edicoes.length > 0 && (
          <div className="my-4">
            <h4 className="text-base font-medium text-gray-700 mb-2">Histórico de Edições</h4>
            <Card className="p-4 border border-gray-200">
              <div className="space-y-3">
                {nota.historico_edicoes.map((edicao) => (
                  <div key={edicao.id} className="flex items-start text-sm">
                    <Edit className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <span className="font-medium">
                        {edicao.editor?.nome_completo || 'Editor desconhecido'}
                      </span>
                      <span className="text-gray-500 mx-1">editou em</span>
                      <span className="text-gray-600">
                        {formatDate(edicao.criado_em)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailDialog;
