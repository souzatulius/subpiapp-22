
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  autor: {
    nome_completo: string;
  };
  area_coordenacao: {
    descricao: string;
  };
}

interface NotaDetailDialogProps {
  nota: NotaOficial | null;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (date: string) => string;
}

const NotaDetailDialog: React.FC<NotaDetailDialogProps> = ({
  nota,
  isOpen,
  onClose,
  formatDate
}) => {
  if (!nota) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#003570]">{nota.titulo}</DialogTitle>
          <DialogDescription className="flex flex-col space-y-1 mt-2">
            <span>Autor: {nota.autor?.nome_completo || 'Não informado'}</span>
            <span>Área: {nota.area_coordenacao?.descricao || 'Não informada'}</span>
            <span>Data de criação: {formatDate(nota.criado_em)}</span>
            <span className={`inline-flex text-xs font-semibold rounded-full px-2 py-1 mt-1 w-fit
              ${nota.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
              ${nota.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${nota.status === 'rascunho' ? 'bg-gray-100 text-gray-800' : ''}
              ${nota.status === 'publicado' ? 'bg-blue-100 text-blue-800' : ''}
              ${nota.status === 'rejeitado' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 text-gray-700 whitespace-pre-wrap">
          {nota.texto}
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailDialog;
