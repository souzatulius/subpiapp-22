
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NotaOficial } from '@/types/nota';
import { NotaStatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface NotaDetailDialogProps {
  nota: NotaOficial;
  isOpen: boolean;
  onClose: () => void;
  formatDate?: (date: string) => string;
  onApprove?: (nota: NotaOficial) => void;
  onReject?: (nota: NotaOficial) => void;
}

const NotaDetailDialog: React.FC<NotaDetailDialogProps> = ({
  nota,
  isOpen,
  onClose,
  formatDate = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
  onApprove,
  onReject
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleEdit = () => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${nota.id}`);
  };
  
  const handleApprove = () => {
    if (onApprove) {
      onApprove(nota);
    }
  };
  
  const handleReject = () => {
    if (onReject) {
      onReject(nota);
    }
  };
  
  const isPendente = nota.status === 'pendente';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold">{nota.titulo}</DialogTitle>
            <NotaStatusBadge status={nota.status} />
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
            <div>
              <span className="text-gray-500">Autor:</span>{' '}
              <span className="font-medium">{nota.autor?.nome_completo || 'Não informado'}</span>
            </div>
            
            <div>
              <span className="text-gray-500">Área:</span>{' '}
              <span className="font-medium">{nota.area_coordenacao?.descricao || nota.problema?.descricao || 'Não informada'}</span>
            </div>
            
            <div>
              <span className="text-gray-500">Data:</span>{' '}
              <span className="font-medium">{formatDate(nota.criado_em)}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="prose max-w-none">
              <div className="whitespace-pre-line">{nota.conteudo || nota.texto}</div>
            </div>
          </div>
          
          {isPendente && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800">
              <p className="text-sm">
                Esta nota está pendente de aprovação. Utilize os botões abaixo para aprovar ou recusar esta nota.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Fechar
            </Button>
            
            <Button
              variant="outline"
              onClick={handleEdit}
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            
            {isPendente && onApprove && (
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
            )}
            
            {isPendente && onReject && (
              <Button
                variant="destructive"
                onClick={handleReject}
              >
                <X className="h-4 w-4 mr-2" />
                Recusar
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailDialog;
