
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Pencil, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface NotaDetailProps {
  nota: {
    id: string;
    titulo: string;
    conteudo: string;
    status: string;
    created_at: string;
    updated_at?: string;
    autor_nome?: string;
    departamento?: string;
    data_aprovacao?: string;
    data_publicacao?: string;
  };
  onAprovar: () => Promise<void>;
  onRejeitar: () => Promise<void>;
  onEditar: () => void;
  isSubmitting: boolean;
  onBack: () => void;
}

const NotaDetailModal: React.FC<NotaDetailProps> = ({
  nota,
  onAprovar,
  onRejeitar,
  onEditar,
  isSubmitting,
  onBack
}) => {
  const getStatusBadge = () => {
    switch (nota.status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
      case 'aprovado':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Aprovado</Badge>;
      case 'publicado':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Publicado</Badge>;
      case 'rejeitado':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{nota.status}</Badge>;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onBack()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes da Nota</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{nota.titulo}</h2>
            {getStatusBadge()}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto whitespace-pre-wrap">
            {nota.conteudo}
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Criado em:
              </p>
              <p className="font-medium">{formatDate(nota.created_at)}</p>
            </div>
            
            {nota.autor_nome && (
              <div>
                <p className="text-gray-500">Autor:</p>
                <p className="font-medium">{nota.autor_nome}</p>
              </div>
            )}
            
            {nota.departamento && (
              <div>
                <p className="text-gray-500">Departamento:</p>
                <p className="font-medium">{nota.departamento}</p>
              </div>
            )}
            
            {nota.data_aprovacao && (
              <div>
                <p className="text-gray-500">Data de aprovação:</p>
                <p className="font-medium">{formatDate(nota.data_aprovacao)}</p>
              </div>
            )}
            
            {nota.data_publicacao && (
              <div>
                <p className="text-gray-500">Data de publicação:</p>
                <p className="font-medium">{formatDate(nota.data_publicacao)}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 sm:flex-none"
          >
            Voltar
          </Button>
          
          <div className="flex gap-2 flex-1 sm:flex-none">
            {nota.status === 'pendente' && (
              <>
                <Button
                  variant="destructive"
                  onClick={onRejeitar}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 flex-1 sm:flex-none"
                >
                  <X className="h-4 w-4" />
                  <span>Rejeitar</span>
                </Button>
                
                <Button
                  variant="default"
                  onClick={onAprovar}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 flex-1 sm:flex-none"
                >
                  <Check className="h-4 w-4" />
                  <span>Aprovar</span>
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              onClick={onEditar}
              disabled={isSubmitting}
              className="flex items-center gap-1 flex-1 sm:flex-none"
            >
              <Pencil className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailModal;
