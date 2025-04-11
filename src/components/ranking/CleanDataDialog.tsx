
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CleanDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CleanDataDialog: React.FC<CleanDataDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const handleCleanData = async () => {
    if (confirmation !== 'LIMPAR') {
      toast.error('Digite "LIMPAR" para confirmar a operação');
      return;
    }

    setIsLoading(true);

    try {
      // Delete records from all tables
      const { error: painelDataError } = await supabase
        .from('painel_zeladoria_dados')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      if (painelDataError) throw painelDataError;
      
      const { error: painelUploadsError } = await supabase
        .from('painel_zeladoria_uploads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (painelUploadsError) throw painelUploadsError;
      
      const { error: sgzStatusHistoricoError } = await supabase
        .from('sgz_status_historico')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (sgzStatusHistoricoError) throw sgzStatusHistoricoError;
      
      const { error: sgzOrdensError } = await supabase
        .from('sgz_ordens_servico')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (sgzOrdensError) throw sgzOrdensError;
      
      const { error: sgzUploadsError } = await supabase
        .from('sgz_uploads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (sgzUploadsError) throw sgzUploadsError;
      
      toast.success('Dados limpos com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error cleaning data:', error);
      toast.error(`Erro ao limpar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
      setConfirmation('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Limpar Todos os Dados
          </DialogTitle>
          <DialogDescription>
            Esta operação irá <span className="font-bold">excluir permanentemente</span> todos os dados do Ranking da Zeladoria, 
            incluindo uploads SGZ e Painel. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-red-50 p-4 rounded-md border border-red-200 my-4">
          <h4 className="text-sm font-medium text-red-700">Serão excluídos:</h4>
          <ul className="list-disc list-inside text-sm text-red-600 mt-2 space-y-1">
            <li>Todas as ordens de serviço SGZ</li>
            <li>Todos os registros de histórico de status</li>
            <li>Todos os uploads SGZ</li>
            <li>Todos os dados do Painel da Zeladoria</li>
            <li>Todos os uploads do Painel da Zeladoria</li>
          </ul>
        </div>
        
        <div className="space-y-2 mt-2">
          <label className="text-sm font-medium" htmlFor="confirmation">
            Digite "LIMPAR" para confirmar a exclusão:
          </label>
          <input
            id="confirmation"
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="LIMPAR"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCleanData} 
            disabled={isLoading || confirmation !== 'LIMPAR'}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? 'Limpando...' : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CleanDataDialog;
