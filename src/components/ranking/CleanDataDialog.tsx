
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

interface CleanDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CleanDataDialog: React.FC<CleanDataDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showFeedback } = useAnimatedFeedback();

  const handleCleanData = async () => {
    setIsLoading(true);
    showFeedback('loading', 'Limpando dados...', { 
      duration: 0,
      progress: 25,
      stage: 'Iniciando limpeza'
    });
    
    try {
      // Delete all data from painel_zeladoria_dados
      const { error: dataDeletionError } = await supabase
        .from('painel_zeladoria_dados')
        .delete()
        .neq('id', 'dummy_id_for_all');
        
      if (dataDeletionError) {
        throw new Error(`Erro ao limpar dados: ${dataDeletionError.message}`);
      }
      
      showFeedback('loading', 'Removendo registros de upload...', { 
        duration: 0,
        progress: 50,
        stage: 'Limpando registros'
      });
      
      // Delete all uploads
      const { error: uploadDeletionError } = await supabase
        .from('painel_zeladoria_uploads')
        .delete()
        .neq('id', 'dummy_id_for_all');
        
      if (uploadDeletionError) {
        throw new Error(`Erro ao limpar registros de upload: ${uploadDeletionError.message}`);
      }
      
      showFeedback('loading', 'Removendo insights salvos...', { 
        duration: 0,
        progress: 75,
        stage: 'Finalizando limpeza'
      });
      
      // Delete all insights
      const { error: insightsDeletionError } = await supabase
        .from('painel_zeladoria_insights')
        .delete()
        .neq('id', 'dummy_id_for_all');
        
      if (insightsDeletionError) {
        throw new Error(`Erro ao limpar insights: ${insightsDeletionError.message}`);
      }
      
      // Show success message and close the dialog
      showFeedback('success', 'Todos os dados foram limpos com sucesso', { duration: 3000 });
      onSuccess();
    } catch (error: any) {
      console.error('Error cleaning data:', error);
      showFeedback('error', `Erro ao limpar dados: ${error.message}`, { duration: 3000 });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Limpar Todos os Dados</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação removerá permanentemente todos os dados de ordens de serviço, uploads e insights.
            Esta operação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleCleanData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Limpando...
              </>
            ) : (
              'Sim, limpar todos os dados'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CleanDataDialog;
