
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotaOficial } from '@/types/nota';
import { Edit, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

interface NotaDetailDialogProps {
  nota: NotaOficial;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (date: string) => string;
  refetch?: () => Promise<void>;
}

const NotaDetailDialog: React.FC<NotaDetailDialogProps> = ({ 
  nota, 
  isOpen, 
  onClose, 
  formatDate,
  refetch 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { showFeedback } = useAnimatedFeedback();

  if (!nota) return null;

  const handleEdit = () => {
    navigate(`/dashboard/comunicacao/notas/editar?id=${nota.id}`);
    onClose();
  };

  const updateNotaStatus = async (status: string) => {
    if (!nota) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: status,
          aprovador_id: status === 'aprovada' ? user?.id : null
        })
        .eq('id', nota.id);

      if (error) throw error;

      toast({
        title: `Nota ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`,
        description: status === 'aprovada' 
          ? "A nota foi aprovada e está pronta para publicação."
          : "A nota foi rejeitada e o autor será notificado."
      });
      
      // Show animated feedback based on status
      if (status === 'aprovada') {
        showFeedback('success', 'Nota aprovada com sucesso!');
      } else {
        showFeedback('error', 'Nota rejeitada');
      }

      // Update the demand status based on note status
      if (nota.demanda_id) {
        const newDemandStatus = status === 'aprovada' ? 'concluida' : 'aguardando_nota';
        
        const { error: demandError } = await supabase
          .from('demandas')
          .update({ status: newDemandStatus })
          .eq('id', nota.demanda_id);
          
        if (demandError) {
          console.error('Error updating demand status:', demandError);
        }
      }

      // Refresh the note data if refetch is provided
      if (refetch) {
        await refetch();
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      
      // Show error feedback
      showFeedback('error', 'Falha ao atualizar nota');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-semibold">{nota.titulo}</DialogTitle>
            <Badge className="rounded-full">{nota.status}</Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <div>
              <span className="font-medium">Autor:</span> {nota.autor?.nome_completo || 'Não informado'}
            </div>
            <div>
              <span className="font-medium">Criada em:</span> {formatDate(nota.criado_em || nota.created_at || '')}
            </div>
            {nota.aprovador && (
              <div>
                <span className="font-medium">Aprovada por:</span> {nota.aprovador.nome_completo}
              </div>
            )}
            {nota.problema?.coordenacao && (
              <div>
                <span className="font-medium">Coordenação:</span> {nota.problema.coordenacao.descricao}
              </div>
            )}
          </div>
          
          <div className="prose max-w-none pt-4 border-t">
            <div
              className="whitespace-pre-wrap rounded-xl p-4 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: nota.texto.replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            <Button 
              variant="outline"
              onClick={handleEdit}
              className="gap-1 rounded-xl"
            >
              <Edit className="h-4 w-4" /> Editar
            </Button>
          </div>
          
          <div className="flex gap-2">
            {nota.status === 'pendente' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => updateNotaStatus('rejeitada')}
                  disabled={isUpdating}
                  className="gap-1 rounded-xl"
                >
                  <X className="h-4 w-4" /> Recusar
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={() => updateNotaStatus('aprovada')}
                  disabled={isUpdating}
                  className="gap-1 rounded-xl"
                >
                  <CheckCircle className="h-4 w-4" /> Aprovar
                </Button>
              </>
            )}
            
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailDialog;
