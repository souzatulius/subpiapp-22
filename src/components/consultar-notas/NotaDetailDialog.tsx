
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Calendar, Building, MessageSquare } from 'lucide-react';
import { NotaOficial } from '@/types/nota';

interface NotaDetailDialogProps {
  nota: NotaOficial;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

const NotaDetailDialog: React.FC<NotaDetailDialogProps> = ({ 
  nota, 
  isOpen, 
  onClose, 
  formatDate 
}) => {
  // Extraction with fallbacks for optional fields
  const autorNome = nota.autor?.nome_completo || 'Autor desconhecido';
  const areaNome = nota.supervisao_tecnica?.descricao || 'Área não informada';
  const aprovadorNome = nota.aprovador?.nome_completo;
  const temDemanda = !!nota.demanda_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{nota.titulo}</DialogTitle>
          <div className="flex flex-col space-y-1 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>Por: {autorNome}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Data: {formatDate(nota.criado_em)}</span>
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              <span>Área: {areaNome}</span>
            </div>
            {temDemanda && (
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Vinculada a demanda: {nota.demanda?.titulo || 'Demanda não encontrada'}</span>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="my-4 pb-4 border-b">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{nota.texto}</p>
          </div>
        </div>
        
        {aprovadorNome && (
          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium mr-2">Aprovado por:</span>
            <span>{aprovadorNome}</span>
          </div>
        )}
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailDialog;
