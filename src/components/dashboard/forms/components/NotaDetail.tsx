
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { ChevronLeft, Edit, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { NotaOficial } from '@/types/nota';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotaDetailProps {
  nota: NotaOficial;
  isOpen: boolean;
  onClose: () => void;
  onAprovar: () => Promise<void>;
  onRejeitar: () => Promise<void>;
  onEditar: () => void;
  isSubmitting: boolean;
}

const NotaDetail: React.FC<NotaDetailProps> = ({ 
  nota, 
  isOpen,
  onClose,
  onAprovar, 
  onRejeitar, 
  onEditar,
  isSubmitting 
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Data desconhecida';
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  if (!nota) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-800">{nota.titulo}</DialogTitle>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEditar}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={onRejeitar}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <XCircle className="h-4 w-4" />
                <span>Rejeitar</span>
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={onAprovar}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Aprovar</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {nota.autor && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Autor:</span>
                <span>{nota.autor.nome_completo}</span>
              </div>
            )}
            
            {nota.problema?.coordenacao && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Coordenação:</span>
                <span>{nota.problema.coordenacao.descricao}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <span className="font-medium">Criada:</span>
              <span>{formatDate(nota.criado_em)}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <div className="border-b pb-4 mb-4">
              <div 
                className="whitespace-pre-wrap text-gray-700"
                dangerouslySetInnerHTML={{ __html: nota.texto.replace(/\n/g, '<br/>') }}
              />
            </div>
            
            {/* Accordion history section */}
            <div>
              <button 
                onClick={toggleHistory}
                className="w-full flex items-center justify-between py-2 text-left font-medium text-gray-600 hover:text-gray-900"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Histórico de alterações</span>
                </div>
                {showHistory ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {showHistory && (
                <div className="pt-2 pb-4 text-sm text-gray-600 space-y-3 border-t mt-2">
                  {nota.historico_edicoes && nota.historico_edicoes.length > 0 ? (
                    nota.historico_edicoes.map((historico, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {historico.editor?.nome_completo || 'Editor desconhecido'}
                          </span>
                          <span>{formatDate(historico.criado_em)}</span>
                        </div>
                        <div className="mt-1">
                          {historico.titulo_anterior !== historico.titulo_novo && (
                            <div className="text-xs">
                              <span className="font-medium">Título alterado:</span>
                              <div className="bg-red-50 text-red-700 p-1 rounded mt-1">{historico.titulo_anterior}</div>
                              <div className="bg-green-50 text-green-700 p-1 rounded mt-1">{historico.titulo_novo}</div>
                            </div>
                          )}
                          
                          {historico.texto_anterior !== historico.texto_novo && (
                            <div className="text-xs mt-2">
                              <span className="font-medium">Texto alterado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Nenhuma alteração registrada.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetail;
